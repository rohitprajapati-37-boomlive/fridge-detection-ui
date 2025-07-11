// components/VoiceInput.jsx

/* global webkitSpeechRecognition */ // ✅ tells ESLint this is a global

import { useEffect, useRef } from "react";

export default function VoiceInput({ onResult }) {
  const recognitionRef = useRef(null);

  useEffect(() => {
    // ✅ Check if browser supports webkitSpeechRecognition
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
      return;
    }

    // ✅ Create recognition instance
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false; // Stop after 1 phrase
    recognition.lang = "en-US"; // English language
    recognition.interimResults = false; // Only final result
    recognition.maxAlternatives = 1; // Only best result

    // ✅ What to do when speech is recognized
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript); // send result to parent
    };

    recognitionRef.current = recognition;

    // Optional: Clean up on unmount
    return () => {
      recognition.stop();
    };
  }, [onResult]);

  // ✅ Start listening when button is clicked
  const startListening = () => {
    recognitionRef.current?.start();
  };

  return (
    <button
      onClick={startListening}
      className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
    >
      🎤 Speak Ingredient
    </button>
  );
}
