import { motion } from 'framer-motion';
import { CloudRain, Languages, Leaf, MessageCircle, ShieldAlert, Sparkles, Sprout } from 'lucide-react';
import { useEffect } from 'react';
import { useAIChat } from '../context/AIChatContext';

const CAPABILITIES = [
  {
    icon: Leaf,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    title: 'Crop care & pest identification',
    desc: 'Describe a symptom in plain words -- yellow spots, wilting, pests -- and get practical, specific advice.',
  },
  {
    icon: Sprout,
    color: 'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400',
    title: 'Soil health & irrigation guidance',
    desc: 'Ask about watering schedules, soil condition, or general field management for your crop.',
  },
  {
    icon: CloudRain,
    color: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
    title: 'Weather-aware advice',
    desc: 'Ask things like "is it safe to spray before rain?" and get advice that accounts for real farming conditions.',
  },
  {
    icon: Languages,
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    title: 'Replies in your language',
    desc: 'Ask in English, Hindi, or Hinglish (romanized Hindi) -- the assistant replies back in the same script and style you used.',
  },
  {
    icon: ShieldAlert,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    title: 'Knows its limits',
    desc: 'For serious or large-scale issues, it will tell you to contact your local agricultural extension office instead of guessing.',
  },
  {
    icon: MessageCircle,
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
    title: 'Text-based, always available',
    desc: 'A real conversation, not a fixed FAQ list -- ask follow-up questions and it responds to what you actually typed.',
  },
];

export const AIAssistant = () => {
  const { openChat } = useAIChat();

  // Opening the sidebar tab opens the SAME assistant panel used everywhere
  // else in the app -- not a separate/duplicate chat experience.
  useEffect(() => {
    openChat();
  }, [openChat]);

  return (
    <div className="space-y-6 lg:pr-96">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-6 py-8 text-white shadow-lg shadow-emerald-900/20 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(120deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 28px)',
          }}
        />
        <div className="relative flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Sparkles className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">FarmVerse AI</p>
            <h2 className="mt-1 text-3xl font-bold leading-tight">Your farming assistant</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
              A real AI you can ask farming questions to, in plain language. The chat panel has opened on the
              right (or tap the sparkle button in the corner) -- ask it anything below.
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {CAPABILITIES.map(({ icon: Icon, color, title, desc }) => (
          <motion.div
            key={title}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">{desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500">
        FarmVerse AI gives general guidance and does not replace advice from a qualified agricultural expert
        for serious crop or safety issues.
      </p>
    </div>
  );
};
