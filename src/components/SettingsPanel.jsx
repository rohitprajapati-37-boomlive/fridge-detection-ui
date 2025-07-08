function SettingsPanel({ voiceEnabled, toggleVoice }) {
  return (
    <div className="mt-6 flex items-center gap-4">
      <label className="text-sm font-medium">Voice Input:</label>
      <button
        onClick={toggleVoice}
        className={`px-4 py-2 rounded-xl text-white ${
          voiceEnabled ? "bg-green-500" : "bg-gray-400"
        }`}
      >
        {voiceEnabled ? "Enabled" : "Disabled"}
      </button>
    </div>
  );
}

export default SettingsPanel;
