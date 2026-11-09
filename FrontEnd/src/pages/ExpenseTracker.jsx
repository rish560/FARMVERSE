import { AnimatePresence, motion } from 'framer-motion';
import {
  Award, Bug, Calculator, Droplets, FlaskConical, Home, MapPin, Package,
  Plus, Receipt, Sprout, Trash2, TrendingDown, TrendingUp, Truck, Users, Wallet, Wrench,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { getMandiPrices } from '../api/mandiApi';
import { INDIA_STATES } from '../constants/indiaStates';
import { PRESET_CROPS } from './RecordManagement';

const CATEGORIES = [
  { key: 'Seeds', icon: Sprout, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400', bar: 'bg-emerald-500' },
  { key: 'Fertilizer', icon: FlaskConical, color: 'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400', bar: 'bg-teal-500' },
  { key: 'Crop Protection', icon: Bug, color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400', bar: 'bg-rose-500' },
  { key: 'Labour', icon: Users, color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400', bar: 'bg-amber-500' },
  { key: 'Irrigation', icon: Droplets, color: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400', bar: 'bg-sky-500' },
  { key: 'Machinery', icon: Wrench, color: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400', bar: 'bg-orange-500' },
  { key: 'Transport', icon: Truck, color: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400', bar: 'bg-violet-500' },
  { key: 'Packaging', icon: Package, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400', bar: 'bg-indigo-500' },
  { key: 'Other', icon: Home, color: 'bg-slate-200 text-slate-600 dark:bg-slate-600/40 dark:text-slate-300', bar: 'bg-slate-400' },
];

const formatINR = (n) =>
  '\u20b9' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-500/20';

const SectionHeader = ({ icon: Icon, color, title, subtitle }) => (
  <div className="flex items-center gap-3">
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
      <Icon className="h-5 w-5" />
    </span>
    <div>
      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  </div>
);

export const ExpenseTracker = () => {
  const [crop, setCrop] = useState('');
  const [area, setArea] = useState('');
  const [expectedProduction, setExpectedProduction] = useState('');

  const [expenses, setExpenses] = useState([]);
  const [entryCategory, setEntryCategory] = useState('Seeds');
  const [entryAmount, setEntryAmount] = useState('');

  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [priceResults, setPriceResults] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState('');

  const categoryTotals = useMemo(() => {
    const totals = {};
    CATEGORIES.forEach((c) => { totals[c.key] = 0; });
    expenses.forEach((e) => { totals[e.category] = (totals[e.category] || 0) + Number(e.amount); });
    return totals;
  }, [expenses]);

  const totalExpense = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [expenses]
  );

  const addExpense = (e) => {
    e.preventDefault();
    const amt = Number(entryAmount);
    if (!amt || amt <= 0) return;
    setExpenses((prev) => [
      ...prev,
      { id: Date.now(), category: entryCategory, amount: amt },
    ]);
    setEntryAmount('');
  };

  const removeExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id));

  const checkMandiPrice = async () => {
    if (!crop) {
      setPriceError('Select a crop first.');
      return;
    }
    if (!state) {
      setPriceError('Select a state first.');
      return;
    }
    if (!district.trim()) {
      setPriceError('Enter a district first.');
      return;
    }
    setPriceLoading(true);
    setPriceError('');
    setPriceResults(null);
    try {
      const data = await getMandiPrices({ state, district: district.trim(), commodity: crop });
      setPriceResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setPriceError(err?.response?.data?.message || 'Could not fetch mandi prices. Please check the details and try again.');
    } finally {
      setPriceLoading(false);
    }
  };

  const productionKg = Number(expectedProduction) || 0;
  const breakEvenPrice = productionKg > 0 ? totalExpense / productionKg : null;

  // One row per real mandi. Profit/revenue are only computed once Expected
  // Production is filled in -- but the mandi list itself (and prices) always
  // shows as soon as results come back, so the farmer isn't staring at a
  // blank screen while figuring that out. Ranked best-profit-first once we
  // have enough info to rank by profit; otherwise ranked by best price.
  const rankedMandis = useMemo(() => {
    if (!priceResults) return [];
    const hasProduction = productionKg > 0;
    const withCalc = priceResults.map((r) => {
      const pricePerKg = r.modalPrice / 100;
      const expectedRevenue = hasProduction ? productionKg * pricePerKg : null;
      const estimatedProfit = hasProduction ? expectedRevenue - totalExpense : null;
      return { ...r, pricePerKg, expectedRevenue, estimatedProfit };
    });
    return hasProduction
      ? withCalc.sort((a, b) => b.estimatedProfit - a.estimatedProfit)
      : withCalc.sort((a, b) => b.pricePerKg - a.pricePerKg);
  }, [priceResults, productionKg, totalExpense]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 px-6 py-8 text-white shadow-lg shadow-emerald-900/20 sm:px-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(120deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 28px)' }}
        />
        <div className="relative flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Calculator className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">Expense Tracker</p>
            <h2 className="mt-1 text-3xl font-bold leading-tight">Estimate your crop's profit</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/85">
              Enter your crop details and expenses to see an estimated profit based on live mandi prices.
              Nothing here is saved &mdash; this is a quick calculator, not a permanent record.
            </p>
          </div>
        </div>
      </div>

      {/* Crop details */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <SectionHeader icon={Sprout} color="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" title="Crop details" subtitle="What you're growing this season" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">Crop</label>
            <select value={crop} onChange={(e) => setCrop(e.target.value)} className={inputClass}>
              <option value="">Select crop</option>
              {PRESET_CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">Farm Area (acres)</label>
            <input type="number" min="0" value={area} onChange={(e) => setArea(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">Expected Production (kg)</label>
            <input type="number" min="0" value={expectedProduction} onChange={(e) => setExpectedProduction(e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Expense entry */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <SectionHeader icon={Receipt} color="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400" title="Track expenses" subtitle="Keep adding as you spend" />

        <form onSubmit={addExpense} className="mt-5 flex flex-wrap items-end gap-3 rounded-xl bg-gray-50 p-3.5 dark:bg-slate-800/50">
          <div className="min-w-[160px] flex-1">
            <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">Category</label>
            <select value={entryCategory} onChange={(e) => setEntryCategory(e.target.value)} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.key}</option>)}
            </select>
          </div>
          <div className="w-32">
            <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">Amount (&#8377;)</label>
            <input type="number" min="0" value={entryAmount} onChange={(e) => setEntryAmount(e.target.value)} className={inputClass} />
          </div>
          <button type="submit" className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md">
            <Plus className="h-4 w-4" /> Add
          </button>
        </form>

        {/* Category totals with proportion bars */}
        <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map(({ key, icon: Icon, color, bar }) => {
            const pct = totalExpense > 0 ? Math.round((categoryTotals[key] / totalExpense) * 100) : 0;
            return (
              <motion.div
                key={key}
                whileHover={{ y: -2 }}
                className="rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}><Icon className="h-4.5 w-4.5" /></span>
                <p className="mt-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">{key}</p>
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">{formatINR(categoryTotals[key])}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} className={`h-full rounded-full ${bar}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Individual entries */}
        <AnimatePresence>
          {expenses.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 space-y-1.5">
              {expenses.map((e) => {
                const cat = CATEGORIES.find((c) => c.key === e.category);
                const Icon = cat?.icon || Home;
                return (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs dark:bg-slate-800/50"
                  >
                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-md ${cat?.color}`}><Icon className="h-3 w-3" /></span>
                      {e.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{formatINR(e.amount)}</span>
                      <button onClick={() => removeExpense(e.id)} className="text-gray-300 transition hover:text-rose-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-4 text-white shadow-md dark:from-slate-800 dark:to-slate-900">
          <span className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Wallet className="h-4 w-4" /> Total Expense
          </span>
          <span className="text-2xl font-bold">{formatINR(totalExpense)}</span>
        </div>
      </div>

      {/* Mandi price lookup */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <SectionHeader icon={MapPin} color="bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400" title="Live mandi prices" subtitle="Enter your state and district -- we'll show every real mandi there reporting this crop" />
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <div className="w-56">
            <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">State</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className={inputClass}>
              <option value="">Select state</option>
              {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="w-48">
            <label className="mb-1.5 block text-xs font-semibold text-gray-500 dark:text-gray-400">District</label>
            <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g. Nashik" className={inputClass} />
          </div>
          <button
            onClick={checkMandiPrice}
            disabled={priceLoading}
            className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <MapPin className="h-4 w-4" /> {priceLoading ? 'Checking...' : 'Check Prices'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {priceError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-500/10">
              {priceError}
            </motion.p>
          )}
        </AnimatePresence>

        {priceResults && productionKg <= 0 && priceResults.length > 0 && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            Showing mandi prices below. Enter <strong>Expected Production (kg)</strong> in Crop Details above to also see estimated profit per mandi.
          </p>
        )}

        {priceResults && priceResults.length === 0 && !priceError && (
          <p className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-slate-800/50 dark:text-gray-400">
            No mandi data came back for this crop, district, and state. Double-check the district spelling (it must match the official name, e.g. "Nashik" not "Nasik"), or try a nearby district.
          </p>
        )}
      </div>

      {/* Ranked mandi comparison -- best profit first */}
      <AnimatePresence>
        {rankedMandis.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3 px-1">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <Sprout className="h-4.5 w-4.5" />
              </span>
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                {crop} &mdash; {area || '\u2014'} Acres &middot; {rankedMandis.length} mandi{rankedMandis.length > 1 ? 's' : ''} found
              </p>
            </div>

            <div className="rounded-xl bg-gray-900 px-5 py-3 text-xs font-medium text-white/70 dark:bg-slate-800">
              Total Expense {formatINR(totalExpense)}
              {productionKg > 0 && (
                <>
                  {' '}&middot; Expected Production {productionKg.toLocaleString('en-IN')} kg &middot; Break-even {formatINR(breakEvenPrice)}/kg
                </>
              )}
            </div>

            {rankedMandis.map((m, i) => {
              const hasProfit = m.estimatedProfit !== null;
              const isProfit = hasProfit && m.estimatedProfit >= 0;
              const isBest = i === 0;
              return (
                <motion.div
                  key={m.market + i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative overflow-hidden rounded-2xl border shadow-sm ${
                    isBest
                      ? 'border-emerald-300 shadow-emerald-100 dark:border-emerald-600 dark:shadow-none'
                      : 'border-gray-100 dark:border-slate-800'
                  }`}
                >
                  {isBest && (
                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-1.5 text-xs font-bold text-white">
                      <Award className="h-3.5 w-3.5" /> {hasProfit ? 'BEST PROFIT' : 'BEST PRICE'}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 dark:bg-slate-900">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{m.market}</p>
                      <p className="text-xs text-gray-400">{m.district}, {m.state} &middot; as of {m.arrivalDate || 'latest available date'}</p>
                      <p className="mt-1.5 text-sm font-semibold text-sky-600 dark:text-sky-400">
                        {formatINR(m.modalPrice)}/quintal &middot; {formatINR(m.pricePerKg)}/kg
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasProfit ? (
                        <>
                          {isProfit ? <TrendingUp className="h-5 w-5 text-emerald-500" /> : <TrendingDown className="h-5 w-5 text-rose-500" />}
                          <div className="text-right">
                            <p className="text-[11px] font-medium uppercase text-gray-400">Est. Profit</p>
                            <p className={`text-xl font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>{formatINR(m.estimatedProfit)}</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-right">
                          <p className="text-[11px] font-medium uppercase text-gray-400">Profit</p>
                          <p className="text-xs font-medium text-gray-400">Add production to see</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <p className="px-1 text-[11px] leading-5 text-gray-400 dark:text-gray-500">
              Estimated profit at each mandi is based on the current mandi price checked above and may differ when you actually sell.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
