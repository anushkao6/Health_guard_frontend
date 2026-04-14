/**
 * HealthGuard AI — Mic Input (Web Speech API)
 * No external API key required — uses the browser's built-in speech recognition.
 * Works in Chrome, Edge, and most Chromium browsers.
 */
(function () {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isRecording = false;

  function isSupported() {
    return !!SpeechRecognition;
  }

  function startMic(inputEl, micBtn) {
    if (!isSupported()) {
      alert('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    if (isRecording) { stopMic(micBtn); return; }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      if (inputEl) {
        inputEl.value = (inputEl.value ? inputEl.value + ' ' : '') + transcript;
        inputEl.dispatchEvent(new Event('input'));
        inputEl.focus();
      }
    };

    recognition.onstart = function () {
      isRecording = true;
      if (micBtn) micBtn.classList.add('recording');
    };

    recognition.onend = function () {
      isRecording = false;
      if (micBtn) micBtn.classList.remove('recording');
    };

    recognition.onerror = function (event) {
      isRecording = false;
      if (micBtn) micBtn.classList.remove('recording');
      if (event.error === 'not-allowed') {
        alert('Microphone access was denied. Please allow microphone access in your browser settings.');
      }
    };

    recognition.start();
  }

  function stopMic(micBtn) {
    if (recognition) {
      recognition.stop();
    }
    isRecording = false;
    if (micBtn) micBtn.classList.remove('recording');
  }

  window.hgMicSupported = isSupported;
  window.hgStartMic = startMic;
  window.hgStopMic = stopMic;
})();
