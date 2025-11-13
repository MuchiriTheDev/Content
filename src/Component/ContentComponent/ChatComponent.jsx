import { MdClose } from 'react-icons/md';
import { FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { GeneralContext } from '../../Context/GeneralContext'
import { FaUpload, FaChartBar, FaCopy, FaExpand, FaCompress, FaPlus, FaTimes, FaImage as FaImageGen, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
// Component for Chatting (handles normal chat conversations)
const ChatComponent = ({ messages, setMessages, inputMessage, setInputMessage, isLoading, setIsLoading, typingText, messagesEndRef, handleKeyPress, sendChatMessage }) => {
  // Simple Markdown parser for basic formatting
  const parseMarkdown = (text) => {
    if (!text) return '';
    let html = text
      // Bold: **text** -> <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic: *text* -> <em>text</em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Headings: ### Heading -> <h3>Heading</h3>
      .replace(/^### (.*$)/gm, '<h3 class="text-sm font-bold mb-2 mt-3 text-brown">$1</h3>')
      // #### Subheading -> <h4>Subheading</h4>
      .replace(/^#### (.*$)/gm, '<h4 class="text-xs font-semibold mb-1 mt-2 text-brown">$1</h4>')
      // Line breaks: \n -> <br>
      .replace(/\n/g, '<br>');
    
    // Basic bullet lists: - Item -> <ul><li>Item</li></ul> (simple, assumes single level)
    html = html.replace(/^-\s+(.*$)/gm, '<li class="list-disc list-inside text-sm ml-4 mb-1">$1</li>');
    if (html.includes('<li')) {
      html = html.replace(/(<li.*?<\/li>)/g, '<ul class="list-disc space-y-1">$1</ul>');
    }
    
    return html;
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3" ref={messagesEndRef}>
      {messages.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 text-brown/50 flex flex-col items-center">
          <FaRobot className="text-6xl mb-4 text-appleGreen animate-bounce" />
          <h3 className="text-lg font-semibold text-brown mb-1">Jambo Creator!</h3>
          <p className="text-sm max-w-sm text-brown/60">Type to chat for insights! 📝</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div key={index} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}>
              <motion.div initial={{ opacity: 0, y: msg.role === 'user' ? 20 : -20 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`flex items-start gap-2 max-w-[85%]`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-appleGreen to-yellowGreen flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaRobot className="text-white text-sm" />
                    </div>
                  )}
                  <motion.div className={`relative p-3 rounded-xl shadow-sm backdrop-blur-md max-w-md ${msg.role === 'user' ? 'bg-gradient-to-r from-brown to-yellowGreen text-white rounded-br-none' : 'bg-gradient-to-r from-appleGreen/10 to-yellowGreen/10 text-brown rounded-bl-none border border-appleGreen/20'}`} whileHover={{ scale: 1.02 }}>
                    <div 
                      className="text-sm leading-relaxed mb-2"
                      dangerouslySetInnerHTML={{ 
                        __html: msg.role === 'assistant' && index === messages.length - 1 && isLoading 
                          ? parseMarkdown(typingText) 
                          : parseMarkdown(msg.content) 
                      }} 
                    />
                    {msg.role === 'assistant' && (
                      <motion.button onClick={() => navigator.clipboard.writeText(msg.content).then(() => toast.success('Copied! 📋'))} className="absolute top-1 right-1 p-1 bg-white/20 rounded-full hover:bg-white/40">
                        <FaCopy className="text-xs text-brown" />
                      </motion.button>
                    )}
                    <p className="text-xs opacity-60 mt-2 text-center text-brown/60">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </motion.div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brown to-yellowGreen flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FaUser className="text-white text-sm" />
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
      {isLoading && (
        <motion.div className="flex justify-start mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="max-w-md p-3 rounded-xl bg-gradient-to-r from-appleGreen/5 to-yellowGreen/5 text-brown border border-appleGreen/10 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <motion.div className="w-2 h-2 bg-brown/40 rounded-full" animate={{ y: [-2, 2, -2] }} transition={{ duration: 0.6, repeat: Infinity }} />
                <motion.div className="w-2 h-2 bg-brown/40 rounded-full" animate={{ y: [0, 4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                <motion.div className="w-2 h-2 bg-brown/40 rounded-full" animate={{ y: [-2, 2, -2] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
              </div>
              <span className="text-sm font-medium text-brown">CICI thinking... 🤔</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};


export default ChatComponent;