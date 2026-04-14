/**
 * HealthGuard AI — Voice Mode (ChatGPT style)
 * Uses Web Speech API for Recognition and Synthesis.
 */
(function() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;
  
  let recognition = null;
  let isMuted = false;
  let currentCallback = null;
  let activeConversationId = null;

  const overlay = document.getElementById('voice-overlay');
  const modal = document.getElementById('voice-modal');
  const statusText = document.getElementById('voice-status');
  const transcriptText = document.getElementById('voice-transcript');
  const responsePreview = document.getElementById('voice-response-preview');
  const closeBtn = document.getElementById('voice-close');
  const muteBtn = document.getElementById('voice-mute-toggle');
  const muteIcon = document.getElementById('mute-icon');

  function updateMuteIcon() {
    if (isMuted) {
      muteIcon.innerHTML = '<path d="M11 5 6 9 2 9 2 15 6 15 11 19 11 5"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
    } else {
      muteIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
    }
  }

  function setStatus(status) {
    const statusLabel = {
      'listening': 'Listening...',
      'thinking': 'Thinking...',
      'speaking': 'Speaking...',
      'error': 'Error occurred'
    };
    statusText.textContent = statusLabel[status] || status;
    modal.className = 'voice-modal ' + status;
  }

  function speak(text) {
    if (isMuted || !text) {
      setTimeout(() => {
        if (overlay.classList.contains('active')) startListening();
      }, 1000);
      return;
    }

    setStatus('speaking');
    
    // Clean text for speech (remove markdown-like things if any)
    const cleanText = text.replace(/[*_#`]/g, '').trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Pick a natural sounding voice if available
    const voices = synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female'))) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (overlay.classList.contains('active')) {
        startListening();
      }
    };

    utterance.onerror = (e) => {
      console.error('SpeechSynthesis error', e);
      if (overlay.classList.contains('active')) startListening();
    };

    synth.speak(utterance);
  }

  function stopEverything() {
    if (recognition) {
        try { recognition.stop(); } catch(e) {}
    }
    synth.cancel();
    overlay.classList.remove('active');
  }

  function startListening() {
    if (!overlay.classList.contains('active')) return;
    
    setStatus('listening');
    transcriptText.textContent = '"Try saying something..."';
    responsePreview.style.display = 'none';

    if (!SpeechRecognition) {
        transcriptText.textContent = "Speech recognition not supported in this browser.";
        return;
    }

    try {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;

        recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        
        transcriptText.textContent = transcript;

        if (event.results[0].isFinal) {
            recognition.stop();
            processUserInput(transcript);
        }
        };

        recognition.onerror = (e) => {
        if (e.error === 'no-speech') {
            // Wait and retry if still active
            setTimeout(() => {
                if (overlay.classList.contains('active')) startListening();
            }, 1000);
        } else if (e.error === 'aborted') {
            // Ignore manual stops
        } else {
            console.error('Recognition error', e.error);
            setStatus('error');
            transcriptText.textContent = "Error: " + e.error;
        }
        };

        recognition.start();
    } catch(e) {
        console.error("Failed to start recognition", e);
    }
  }

  async function processUserInput(text) {
    if (!text || !text.trim()) {
        if (overlay.classList.contains('active')) startListening();
        return;
    }

    setStatus('thinking');
    if (currentCallback && currentCallback.onMessage) {
      currentCallback.onMessage(text, 'user');
    }

    try {
      const body = { message: text };
      if (activeConversationId) body.conversationId = activeConversationId;
      
      const res = await hgFetch("/chat/send", { method: "POST", body });
      
      if (res.conversationId) {
        activeConversationId = res.conversationId;
        if (currentCallback && currentCallback.onConversationId) {
            currentCallback.onConversationId(res.conversationId);
        }
      }

      const botMsg = res.content || res.botResponse || res.message;
      
      responsePreview.textContent = botMsg;
      responsePreview.style.display = 'block';
      
      if (currentCallback && currentCallback.onMessage) {
        currentCallback.onMessage(botMsg, 'bot');
      }

      speak(botMsg);
    } catch (e) {
      console.error('Chat error', e);
      transcriptText.textContent = 'Error: ' + e.message;
      setStatus('error');
      setTimeout(() => {
        if (overlay.classList.contains('active')) startListening();
      }, 3000);
    }
  }

  window.hgOpenVoiceMode = function(options) {
    currentCallback = options;
    activeConversationId = options.conversationId;
    overlay.classList.add('active');
    
    // Ensure voices are loaded (some browsers need this)
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = () => {};
    }
    
    startListening();
  };

  closeBtn.addEventListener('click', stopEverything);
  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    updateMuteIcon();
    if (isMuted) synth.cancel();
  });

  window.hgStopVoiceMode = stopEverything;
  window.hgMicSupported = () => !!SpeechRecognition;

})();
