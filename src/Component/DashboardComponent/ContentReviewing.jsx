import React, { useContext, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Correct import for the SDK
import { FaUpload, FaChartBar, FaCopy, FaExpand, FaCompress, FaPlus, FaTimes, FaImage as FaImageGen, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext';
import Loading from '../../Resources/Loading';
import ChatComponent from '../ContentComponent/ChatComponent';
import ImageGenerator from '../ContentComponent/ImageGenerator';
import ImageEnhancer from '../ContentComponent/ImageEnhancer';
import ContentAnalyzer from '../ContentComponent/ContentAnalyzer';

// Utility to convert file to base64 (shared across components)
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result).split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

// CICI System Prompt (shared)
const ciciSystemPrompt = `
You're CICI, the CCI AI Assistant—a smart, encouraging sidekick for Kenyan YouTube creators! 😊 Jambo! Help with content analysis (risks like demonetization, suspension, bans), image generation/enhancement, niche tips (comedy, vlogs), and research on trends/sponsors. Keep responses warm, concise, actionable—like a creative bestie. Use 7+ emojis per response: 🚀📹⚠️💡✨😄🛡️.

**Style Rules**:
- **Tone**: Friendly, hype, Kenyan-flavored ("Hakuna matata, creator!"). Short sentences. Bold tips (**Blur background for privacy!**).
- **Format**: Markdown: #### **Section** for breakdowns. Line breaks. End with question: "Tweak this or gen more? 😄"
- **Memory**: Personalize from chat history.
- **Risks**: Always % for demonetization/suspension/ban (0-100). Low: 👍 Tips; High: 🚨 Fixes.
- **Images**: For gen/enhance, suggest vivid prompts. Tie to CCI protection.
- **Insights**: Base on content type (e.g., "For vlogs: Add calls-to-action!").
- **Safety**: Promote positive, safe creation. No disclaimers.

**Review Structure** (For Analyze Mode):
#### **Risk Breakdown** 😎
- Demonetization: XX% (Reason + Fix)
- Suspension: XX% (Tip)
- Ban: XX% (Advice)

#### **Insights & Tips** 💡
- Bullet 1
- Bullet 2

#### **Next** 🚀
[Idea]

**Enhance/Gen Structure** (For Enhance Mode):
#### **Enhanced/Generated Image Suggestion** 📸
- Short intro with emojis.
- #### **Prompt Used** (Your refined prompt)
- #### **Tips for Use** (Bullets: How to optimize for CCI)
- End with question.

**Normal Chat**:
- Keep short, engaging. Use structure if relevant (e.g., tips as bullets).

Example: "Enhance this thumbnail." → "Vibrant Nairobi vibe: Generate prompt... 📸"
`;

// Shared API Key and AI Instance
const API_KEY = "AIzaSyBPPTjHxdna3ez3alyquR_rEe1wM-ObOak"; // Replace with env var if needed
const genAI = new GoogleGenerativeAI(API_KEY);

// Main Component that integrates all separate components with tabs
const ContentReviewing = () => {
  const { loading: globalLoading, setLoading: setGlobalLoading } = useContext(GeneralContext);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('ciciChatMessages');
    const savedTimestamp = localStorage.getItem('ciciChatTimestamp');
    const currentTime = Date.now();
    const eightHours = 8 * 60 * 60 * 1000;

    if (savedMessages && savedTimestamp && currentTime - savedTimestamp < eightHours) {
      try {
        return JSON.parse(savedMessages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
        localStorage.removeItem('ciciChatMessages');
        localStorage.removeItem('ciciChatTimestamp');
        return [];
      }
    } else {
      localStorage.removeItem('ciciChatMessages');
      localStorage.removeItem('ciciChatTimestamp');
      return [];
    }
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analysisText, setAnalysisText] = useState('');
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [enhancePrompt, setEnhancePrompt] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  useEffect(() => {
    localStorage.setItem('ciciChatMessages', JSON.stringify(messages));
    if (messages.length > 0 && !localStorage.getItem('ciciChatTimestamp')) {
      localStorage.setItem('ciciChatTimestamp', Date.now());
    }

    const timeout = setTimeout(() => {
      setMessages([]);
      localStorage.removeItem('ciciChatMessages');
      localStorage.removeItem('ciciChatTimestamp');
      toast.info('Chat session expired. Start fresh! 🌟');
    }, 8 * 60 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1000) {
      toast.error('File too big (5MB max)! 📏');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image! 🎥');
      return;
    }

    setFilePreview(URL.createObjectURL(file));
    toast.success('Image ready for enhancement! ✅');
  };

  const clearFile = () => {
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendChatMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInputMessage('');

    // Add a placeholder assistant message for typing effect
    const placeholderAssistant = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, placeholderAssistant]);

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: ciciSystemPrompt,
      });

      const chat = model.startChat({
        history: messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })).filter((_, i) => i < messages.length - 1), // Exclude the new user message and placeholder
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      const result = await chat.sendMessage(inputMessage.trim());
      const fullResponse = await result.response.text();

      // Update the placeholder with the full response
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = fullResponse;
        return updated;
      });

      // Typing effect simulation (optional, as full text is now set)
      setTypingText(fullResponse); // Set full text immediately, or implement incremental reveal if desired

      toast.success('CICI responded! 🚀');
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: `Oops, hakuna matata! 😅 Let's try again. What's your content vibe?`,
          timestamp: new Date().toISOString(),
        };
        return updated;
      });
      toast.error('Hiccup—check connection! ⚠️');
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setInputMessage('');
    clearFile();
    toast.success('New chat! 🌟');
  };

  const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  if (globalLoading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen flex flex-col bg-gradient-to-br from-white via-white to-appleGreen/10 p-2 md:p-4 transition-all duration-300 ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Header */}
      <motion.div className={`text-center mb-4 pt-3 pb-2 bg-gradient-to-r from-appleGreen/10 to-yellowGreen/10 rounded-t-2xl border-b border-appleGreen/20 flex justify-between items-center px-3 ${isFullScreen ? 'rounded-t-none' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-appleGreen to-yellowGreen rounded-full flex items-center justify-center shadow-lg">
            <FaRobot className="text-white text-sm" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-brown to-appleGreen bg-clip-text text-transparent">
              CICI AI Assistant
            </h1>
            <p className="text-xs text-brown/60">Your creator sidekick! 📹🚀</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button onClick={startNewConversation} whileHover={{ scale: 1.1 }} className="p-1.5 text-appleGreen hover:text-yellowGreen text-sm">
            <FaPlus />
          </motion.button>
          <motion.button onClick={toggleFullScreen} whileHover={{ scale: 1.1 }} className="p-1.5 text-appleGreen hover:text-yellowGreen text-sm">
            {isFullScreen ? <FaCompress /> : <FaExpand />}
          </motion.button>
          {isFullScreen && (
            <motion.button onClick={() => setIsFullScreen(false)} whileHover={{ scale: 1.1 }} className="p-1.5 text-red-500 hover:text-red-600">
              <MdClose />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-appleGreen/20">
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'chat' ? 'bg-appleGreen text-white' : 'text-brown'}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        {/* <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'generate' ? 'bg-appleGreen text-white' : 'text-brown'}`}
          onClick={() => setActiveTab('generate')}
        >
          Generate Image
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'enhance' ? 'bg-appleGreen text-white' : 'text-brown'}`}
          onClick={() => setActiveTab('enhance')}
        >
          Enhance Image
        </button> */}
        <button
          className={`flex-1 py-2 text-sm font-medium ${activeTab === 'analyze' ? 'bg-appleGreen text-white' : 'text-brown'}`}
          onClick={() => setActiveTab('analyze')}
        >
          Analyze Content
        </button>
      </div>

      {/* Tab Content */}
      <div className={`w-full  mx-auto flex-1 flex flex-col bg-white/95  overflow-hidden ${isFullScreen ? 'h-full' : ''}`}>
        {activeTab === 'chat' && (
          <>
            <ChatComponent
              messages={messages}
              setMessages={setMessages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              typingText={typingText}
              messagesEndRef={messagesEndRef}
              handleKeyPress={handleKeyPress}
              sendChatMessage={sendChatMessage}
            />
            <div className="p-3 md:p-4 border-t border-appleGreen/10 bg-gradient-to-r from-appleGreen/3 to-yellowGreen/3">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Chat with CICI... 📝"
                    className="w-full p-3 pr-12 bg-white/80 border border-brown/10 rounded-lg focus:ring-1 focus:ring-appleGreen placeholder-brown/40 shadow-sm text-brown text-sm"
                    disabled={isLoading}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={sendChatMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className={`p-3 rounded-lg shadow-sm min-w-[40px] ${isLoading || !inputMessage.trim() ? 'bg-brown/10 cursor-not-allowed text-brown/40' : 'bg-gradient-to-r from-appleGreen to-yellowGreen text-white hover:shadow-appleGreen/20'}`}
                >
                  {isLoading ? <FaSpinner className="animate-spin text-sm" /> : <FiSend className="text-sm" />}
                </motion.button>
              </div>
            </div>
          </>
        )}
        {/* {activeTab === 'generate' && (
          <ImageGenerator
            prompt={generationPrompt}
            setPrompt={setGenerationPrompt}
            setGeneratedImage={setGeneratedImage}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            showImagePopup={showImagePopup}
            setShowImagePopup={setShowImagePopup}
          />
        )} */}
        {/* {activeTab === 'enhance' && (
          <ImageEnhancer
            filePreview={filePreview}
            setFilePreview={setFilePreview}
            prompt={enhancePrompt}
            setPrompt={setEnhancePrompt}
            enhancedImage={enhancedImage}
            setEnhancedImage={setEnhancedImage}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            clearFile={clearFile}
            showImagePopup={showImagePopup}
            setShowImagePopup={setShowImagePopup}
          />
        )} */}
       {activeTab === 'analyze' && (
        <ContentAnalyzer
          text={analysisText}
          setText={setAnalysisText}
          analysis={analysis}
          setAnalysis={setAnalysis}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          showReviewPopup={showReviewPopup}
          setShowReviewPopup={setShowReviewPopup}
          genAI={genAI}  // Add this prop
        />
      )}
      </div>

      {/* Image Popup */}
      <AnimatePresence>
        {showImagePopup && (generatedImage || enhancedImage) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowImagePopup(false)}>
            <motion.div className="relative bg-black/20 rounded-xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-full" onClick={(e) => e.stopPropagation()}>
              <img src={generatedImage || enhancedImage} alt="Image" className="w-full h-auto max-h-[85vh] object-contain" />
              <button onClick={() => setShowImagePopup(false)} className="absolute top-3 right-3 p-2 bg-red-500/80 rounded-full text-white hover:bg-red-600">
                <FaTimes className="text-lg" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContentReviewing;