import { AnimatePresence, motion } from 'framer-motion';
import { Leaf, RotateCcw, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { askFarmVerseAi } from '../../api/aiApi';
import { useAIChat } from '../../context/AIChatContext';
import { useToast } from '../../context/ToastContext';

const SUGGESTIONS = [
  'My tomato leaves have yellow spots, what should I do?',
  'When is the best time to irrigate wheat?',
  'How do I improve soil health naturally?',
  'Is it safe to spray pesticide before rain?',
];

export const FarmVerseAIWidget = () => {
  const { addToast } = useToast();
  const { isOpen: open, toggleChat, closeChat } = useAIChat();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const sendMessage = async (question) => {
    if (!question.trim() || loading) return;
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setLoading(true);

    try {
      const data = await askFarmVerseAi({ question });
      setMessages((prev) => [...prev, { role: 'ai', text: data.answer }]);
    } catch (err) {
      setError('FarmVerse AI could not respond. Please try again.');
      addToast('AI assistant failed to respond', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput('');
    sendMessage(q);
  };

  const handleRetry = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) sendMessage(lastUser.text);
  };

  return (
    <>
      {/* Floating launcher button */}
      <motion.button
        type="button"
        onClick={toggleChat}
        aria-label="Open FarmVerse AI assistant"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-600/40 ring-4 ring-emerald-500/20"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" style={{ animationDuration: '2.4s' }} />
        <span className="relative">
          {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
        </span>
      </motion.button>

      {/* Slide-in chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 40, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-6 z-40 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[1.5rem] border border-emerald-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-emerald-900/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <Leaf className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-tight">FarmVerse AI</p>
                  <p className="flex items-center gap-1 text-[11px] text-emerald-50">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Online &middot; here to help
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeChat}
                aria-label="Close chat"
                className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-500 dark:text-gray-400">
                    Ask me about crop care, pest control, soil health, or field advice.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => sendMessage(s)}
                        className="rounded-xl border border-emerald-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-left text-xs text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'ml-auto rounded-br-sm bg-emerald-600 text-white'
                      : 'rounded-bl-sm border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-gray-300'
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 w-fit">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: '300ms' }} />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-xs text-rose-600">
                  {error}
                  <button type="button" onClick={handleRetry} className="flex items-center gap-1 underline">
                    <RotateCcw className="h-3 w-3" /> Retry
                  </button>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your farming question..."
                disabled={loading}
                className="flex-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
