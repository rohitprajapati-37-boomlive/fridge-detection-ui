// VoiceInput.jsx
import { useEffect } from 'react';

function VoiceInput({ onResult }) {
  useEffect(() => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = () => onResult('');
    recognition.start();

    return () => recognition.abort();
  }, [onResult]);

  return null;
}

export default VoiceInput;