// Component for Image Generation
import { MdClose } from 'react-icons/md';
import { FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext';
import { FaUpload, FaChartBar, FaCopy, FaExpand, FaCompress, FaPlus, FaTimes, FaImage as FaImageGen, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';

const ImageGenerator = ({ prompt, setPrompt, setGeneratedImage, isLoading, setIsLoading, showImagePopup, setShowImagePopup }) => {
  const generateImage = async () => {
    setIsLoading(true);
    try {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
      });
      console.log("Image generation response:", response);

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        setGeneratedImage(`data:image/png;base64,${base64ImageBytes}`);
        toast.success('Image generated! 🎨');
      } else {
        throw new Error("No image generated.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error('Failed to generate image. ⚠️');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white/95 rounded-2xl shadow-lg border border-appleGreen/10 h-full">
      <h3 className="text-lg font-bold text-brown mb-2">Generate Image 📸</h3>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt for image generation..."
        className="w-full p-3 bg-white/80 border border-brown/10 rounded-lg focus:ring-1 focus:ring-appleGreen placeholder-brown/40 shadow-sm text-brown text-sm mb-2"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={generateImage}
        disabled={isLoading || !prompt.trim()}
        className={`w-full p-3 rounded-lg shadow-sm ${isLoading || !prompt.trim() ? 'bg-brown/10 cursor-not-allowed text-brown/40' : 'bg-gradient-to-r from-appleGreen to-yellowGreen text-white hover:shadow-appleGreen/20'}`}
      >
        {isLoading ? <FaSpinner className="animate-spin text-sm" /> : 'Generate'}
      </motion.button>
      {setGeneratedImage && (
        <motion.img
          src={setGeneratedImage}
          alt="Generated"
          className="w-full max-w-sm rounded-lg cursor-pointer border border-yellowGreen/20 mt-2"
          onClick={() => setShowImagePopup(true)}
        />
      )}
    </div>
  );
};

export default ImageGenerator;
