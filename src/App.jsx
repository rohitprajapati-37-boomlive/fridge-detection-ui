import { useState } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import UploadImage from "./components/UploadImage";
import VoiceInput from "./components/VoiceInput";
import DetectedItems from "./components/DetectedItems";
import SettingsPanel from "./components/SettingsPanel";
import FridgeScanner from "./components//FridgeScanner";
import ItemCard from "./components/ItemCard";


function App() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const handleVoiceResult = (text) => {
    setSearch(text);
    // Optional: fetch recipe directly for spoken name
  };

  return (
    <>
      <Navbar />
      <main className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center gap-4">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
          <UploadImage setDetectedItems={setItems} />
          {voiceEnabled && <VoiceInput onResult={handleVoiceResult} />}
        </div>
        <DetectedItems items={items} />
        <div className="mt-6">
          <SettingsPanel voiceEnabled={voiceEnabled} toggleVoice={() => setVoiceEnabled(!voiceEnabled)} />
        </div>

<div className="mt-6">
          <FridgeScanner voiceEnabled={voiceEnabled} toggleVoice={() => setVoiceEnabled(!voiceEnabled)} />
        </div>



      </main>
    </>
  );
}

export default App;
