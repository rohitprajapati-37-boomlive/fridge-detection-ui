import { Camera } from "lucide-react";
import { detectObjects as detectItemsFromImage } from "../utils/imageDetection";


function UploadImage({ setDetectedItems }) {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const detected = await detectItemsFromImage(file);
    setDetectedItems(detected);
  };

  return (
    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl shadow-md hover:bg-orange-600">
      <Camera size={20} />
      Upload Image
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </label>
  );
}

export default UploadImage;
