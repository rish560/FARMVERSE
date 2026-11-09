export const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_30%),linear-gradient(135deg,_#f6fdf8,_#edf2ea)] px-4 py-10">
      <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)]">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">Access denied</p>
        <h1 className="mt-6 text-4xl font-semibold text-slate-900 dark:text-gray-100">Unauthorized</h1>
        <p className="mt-4 text-slate-600 dark:text-gray-400">You do not have permission to view this page. Please sign in with an authorized account or contact your administrator.</p>
        <a href="/login" className="mt-8 inline-flex rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">Return to login</a>
      </div>
    </div>
  );
};
