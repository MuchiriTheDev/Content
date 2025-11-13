// Component for Image Enhancement
import { MdClose } from 'react-icons/md';
import { FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext';
import { FaUpload, FaChartBar, FaCopy, FaExpand, FaCompress, FaPlus, FaTimes, FaImage as FaImageGen, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
const ImageEnhancer = ({ filePreview, setFilePreview, prompt, setPrompt, enhancedImage, setEnhancedImage, isLoading, setIsLoading, fileInputRef, handleFileChange, clearFile, showImagePopup, setShowImagePopup }) => {
  const enhanceImage = async () => {
    if (!filePreview) return;
    setIsLoading(true);
    try {
      const imageBase64 = await fileToBase64(await fetch(filePreview).then(res => res.blob()));
      const mimeType = 'image/png'; // Adjust based on file type
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{
          parts: [
            { inlineData: { data: imageBase64, mimeType } },
            { text: prompt || 'Enhance this image for better appeal' },
          ],
        }],
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes = part.inlineData.data;
          setEnhancedImage(`data:image/png;base64,${base64ImageBytes}`);
          toast.success('Image enhanced! 📸');
          return;
        }
      }
      throw new Error("No edited image returned.");
    } catch (error) {
      console.error("Error editing image:", error);
      toast.error('Failed to enhance image. ⚠️');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white/95 rounded-2xl shadow-lg border border-appleGreen/10 h-full">
      <h3 className="text-lg font-bold text-brown mb-2">Enhance Image 🛠️</h3>
      <label className="p-2.5 bg-white/60 rounded-lg cursor-pointer hover:bg-appleGreen/5 border border-brown/10 flex items-center justify-center mb-2">
        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
        <FaUpload className="text-brown text-base" />
      </label>
      {filePreview && (
        <div className="flex items-center gap-1 mb-2">
          <img src={filePreview} alt="Preview" className="h-8 w-8 object-cover rounded border border-brown/10" />
          <motion.button onClick={clearFile} whileHover={{ scale: 1.1 }} className="text-red-500 text-xs">
            <FaTimes size={10} />
          </motion.button>
        </div>
      )}
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enhancement prompt..."
        className="w-full p-3 bg-white/80 border border-brown/10 rounded-lg focus:ring-1 focus:ring-appleGreen placeholder-brown/40 shadow-sm text-brown text-sm mb-2"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={enhanceImage}
        disabled={isLoading || !filePreview}
        className={`w-full p-3 rounded-lg shadow-sm ${isLoading || !filePreview ? 'bg-brown/10 cursor-not-allowed text-brown/40' : 'bg-gradient-to-r from-appleGreen to-yellowGreen text-white hover:shadow-appleGreen/20'}`}
      >
        {isLoading ? <FaSpinner className="animate-spin text-sm" /> : 'Enhance'}
      </motion.button>
      {enhancedImage && (
        <motion.img
          src={enhancedImage}
          alt="Enhanced"
          className="w-full mt-2 rounded-lg cursor-pointer"
          onClick={() => setShowImagePopup(true)}
        />
      )}
    </div>
  );
};

export default ImageEnhancer;