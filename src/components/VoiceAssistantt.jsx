import React from 'react';

const VoiceAssistantt = ({ onPromptSubmit, setIsRecording }) => {
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('❌ Your browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('🎙️ Voice recognition started');
      setIsRecording(true);
    };

    recognition.onend = () => {
      console.log('🛑 Voice recognition ended');
      setIsRecording(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      const greetings = ['hi', 'hello', 'hey', 'good morning', 'good evening'];
      const isGreeting = greetings.some((greet) =>
        transcript.toLowerCase().includes(greet)
      );

      if (isGreeting) {
        const reply = 'Hi, what would you like to design today?';
        const synth = window.speechSynthesis;
        synth.cancel();
        synth.speak(new SpeechSynthesisUtterance(reply));
        onPromptSubmit(reply, false);
      } else {
        setIsRecording(false);
        onPromptSubmit(transcript, true); // true = submit immediately

      }
    };

    recognition.onerror = (event) => {
      console.error('❗ Speech Recognition Error:', event.error);
      alert(`Microphone error: ${event.error}`);
      setIsRecording(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error('Recognition failed to start:', err);
      alert('Speech recognition failed to start.');
      setIsRecording(false);
    }
  };

  return (
    <button
      onClick={handleVoiceInput}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        position: 'absolute',
        inset: 0,
        zIndex: 20,
      }}
      title="Tap to speak"
    />
  );
};

export default VoiceAssistantt;
