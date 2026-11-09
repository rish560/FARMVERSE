import { motion } from 'framer-motion';
import { Leaf, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.png';

export const Landing = () => {
  return (
    <div className="min-h-screen w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* ── Hero: photo bleeds full width, dark green gradient reads
             left → right so the headline sits on solid color while the
             crop photo still shows through on the right ── */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Corn seedlings at sunrise"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #0F2A15 0%, #123318 32%, rgba(15,42,21,0.75) 52%, rgba(15,42,21,0.15) 72%, rgba(15,42,21,0) 88%)',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20">
                <Leaf className="h-5 w-5 text-green-400" />
              </div>
              <span className="text-xl font-bold text-white">FarmVerse</span>
            </div>

            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Smart Farming
              <br />
              for{' '}
              <span className="bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent">
                Sustainable Growth
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              FarmVerse helps farmers make data-driven decisions with dashboards and analytics for healthier crops and better yields.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to="/login">
                <button className="flex items-center gap-2 rounded-full border border-green-400/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5">
                  <UserRound className="h-4 w-4" />
                  Sign In
                </button>
              </Link>
              <Link to="/register">
                <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition hover:opacity-90">
                  <Leaf className="h-4 w-4" />
                  Get Started
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="bg-white px-6 py-6 sm:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-4 text-sm font-semibold uppercase tracking-wide text-[#1F4028]">
          <span className="h-px flex-1 bg-[#E4DCC8]" />
          <span className="flex items-center gap-2 whitespace-nowrap">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            Trusted by leading farms &amp; agricultural organizations
          </span>
          <span className="h-px flex-1 bg-[#E4DCC8]" />
        </div>
      </section>
    </div>
  );
};
