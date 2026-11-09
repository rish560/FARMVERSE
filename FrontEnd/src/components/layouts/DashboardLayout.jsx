import { motion } from 'framer-motion';
import {
  Bell,
  ChevronRight,
  Leaf,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  UserCircle,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '../features/LanguageSwitcher';
import { FarmVerseAIWidget } from '../features/FarmVerseAIWidget';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { normalizeRole } from '../../config/roleRoutes';
import { navConfig } from '../../config/navConfig';
import { useSmartAlerts } from '../../hooks/useSmartAlerts';

// Colored icon chip per nav item -- full literal class strings so Tailwind's
// build can detect and generate them (dynamic string concatenation would not
// be picked up by Tailwind's content scanner).
const NAV_ICON_COLORS = {
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  teal: 'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400',
  violet: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
  indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400',
  slate: 'bg-slate-200 text-slate-600 dark:bg-slate-600/40 dark:text-slate-300',
};

// Role-signature colors, matching the dashboard hero banners -- so the
// sidebar, role badge, active nav state, and profile avatar all feel like
// one cohesive identity per role instead of everything being flat green.
const ROLE_ACCENT = {
  ADMIN: {
    badge: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm shadow-violet-500/30',
    active: 'bg-violet-50 text-violet-700 border-l-violet-500 dark:bg-violet-500/10 dark:text-violet-400 dark:border-l-violet-500',
    avatar: 'bg-gradient-to-br from-violet-400 to-purple-600 shadow-md shadow-violet-500/30',
  },
  FARM_MANAGER: {
    badge: 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm shadow-sky-500/30',
    active: 'bg-sky-50 text-sky-700 border-l-sky-500 dark:bg-sky-500/10 dark:text-sky-400 dark:border-l-sky-500',
    avatar: 'bg-gradient-to-br from-sky-400 to-blue-600 shadow-md shadow-sky-500/30',
  },
  GUEST: {
    badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/30',
    active: 'bg-amber-50 text-amber-700 border-l-amber-500 dark:bg-amber-500/10 dark:text-amber-400 dark:border-l-amber-500',
    avatar: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-amber-500/30',
  },
};

const initials = (name) =>
  (name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || 'U';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const currentRole = normalizeRole(user?.role);
  const filteredNav = useMemo(
    () => navConfig.filter((item) => item.allowedRoles.includes(currentRole)),
    [currentRole],
  );

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return filteredNav.filter((item) => {
      const label = (t(item.labelKey) !== item.labelKey ? t(item.labelKey) : item.label) || '';
      return label.toLowerCase().includes(query) || item.to.toLowerCase().includes(query);
    });
  }, [searchQuery, filteredNav, t]);

  const goToSearchResult = (to) => {
    navigate(to);
    setSearchQuery('');
    setShowSearchResults(false);
    setMobileOpen(false);
  };

  const navSections = useMemo(() => {
    return filteredNav.reduce((acc, item) => {
      const section = item.section || 'Primary';
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    }, {});
  }, [filteredNav]);

  const pathLabel = location.pathname.replace('/dashboard/', '').replace('/', ' ') || 'Overview';
  const activeNavItem = filteredNav.find((item) => item.to === location.pathname);
  const translatedPathLabel = activeNavItem
    ? t(activeNavItem.labelKey)
    : (location.pathname === '/dashboard' ? t('dashboard') : pathLabel);

  const ROLE_LABEL_KEYS = {
    ADMIN: 'adminRole',
    FARM_MANAGER: 'farmManagerRole',
    GUEST: 'guestRole',
  };
  const roleLabel = ROLE_LABEL_KEYS[currentRole] ? t(ROLE_LABEL_KEYS[currentRole]) : (user?.role || t('dashboard'));
  const accent = ROLE_ACCENT[currentRole] || ROLE_ACCENT.GUEST;
  const { alerts } = useSmartAlerts();
  const hasAlerts = Array.isArray(alerts) && alerts.length > 0;

  const SECTION_KEYS = {
    Overview: 'overviewSection',
    Management: 'managementSection',
    'Farm operations': 'farmOperationsSection',
    Insights: 'insightsSection',
    Information: 'informationSection',
    Account: 'accountSection',
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-gray-100">
      {/* ── Sidebar ── */}
      <>
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-20 bg-gray-900/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-white shadow-[4px_0_24px_-8px_rgba(15,23,42,0.06)] transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:static lg:translate-x-0`}
        >
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm shadow-emerald-500/30">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-gray-100">FarmVerse</span>
            </div>
            <button
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden dark:text-gray-500 dark:hover:bg-slate-800 dark:hover:text-gray-300"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Role badge */}
          <div className="border-b border-gray-100 px-5 py-3 dark:border-slate-800">
            <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${accent.badge}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              {roleLabel} {t('workspace')}
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {Object.entries(navSections).map(([section, items]) => (
              <div key={section} className="mb-5">
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  {t(SECTION_KEYS[section] || section)}
                </p>
                <div className="space-y-0.5">
                  {items.map((navItem) => {
                    const { to, label, icon: Icon, color } = navItem;
                    const chipClasses = NAV_ICON_COLORS[color] || NAV_ICON_COLORS.slate;
                    return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-lg border-l-4 border-transparent px-2 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? accent.active
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-gray-100'
                        }`
                      }
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${chipClasses}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        {t(navItem.labelKey) !== navItem.labelKey ? t(navItem.labelKey) : label}
                      </span>
                    </NavLink>
                  );})}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom: user profile + logout */}
          <div className="border-t border-gray-200 p-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/dashboard/profile')}
              className="mb-1 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${accent.avatar}`}>
                {initials(user?.fullName || user?.name || user?.username)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {user?.fullName || user?.name || user?.username || 'User'}
                </p>
                <p className="truncate text-[11px] text-gray-400 dark:text-gray-500">{roleLabel}</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => { logout(); navigate('/login'); }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {t('signOut')}
            </button>
          </div>
        </aside>
      </>

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900"
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden dark:text-gray-500 dark:hover:bg-slate-800 dark:hover:text-gray-300"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-green-600">
                {roleLabel}
              </p>
              <p className="text-sm font-semibold capitalize text-gray-900 dark:text-gray-100">{translatedPathLabel}</p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden sm:block">
              <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-500">
                <Search className="h-4 w-4" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 150)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (searchResults.length > 0) {
                        goToSearchResult(searchResults[0].to);
                      } else if (searchQuery.trim()) {
                        addToast(`No pages found for "${searchQuery.trim()}".`, 'info');
                      }
                    } else if (e.key === 'Escape') {
                      setShowSearchResults(false);
                    }
                  }}
                  className="w-32 bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-gray-200"
                  placeholder={t('search')}
                  aria-label="Search everything"
                />
              </label>

              {showSearchResults && searchQuery.trim() && (
                <div className="absolute right-0 top-full z-40 mt-1 w-64 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  {searchResults.length > 0 ? (
                    <ul className="max-h-72 overflow-y-auto py-1">
                      {searchResults.map((item) => {
                        const Icon = item.icon;
                        const label = t(item.labelKey) !== item.labelKey ? t(item.labelKey) : item.label;
                        return (
                          <li key={item.to}>
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => goToSearchResult(item.to)}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-800"
                            >
                              <Icon className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                              {label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="px-3 py-2.5 text-sm text-gray-400 dark:text-gray-500">
                      No matching pages found.
                    </p>
                  )}
                </div>
              )}
            </div>

            <LanguageSwitcher />

            <button
              className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 dark:border-slate-600 dark:bg-slate-700 dark:text-amber-300 dark:hover:bg-slate-600 dark:hover:text-amber-200"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <button
              type="button"
              aria-label="Open notifications"
              onClick={() =>
                currentRole === 'GUEST'
                  ? addToast('Guests do not receive operational notifications.', 'info')
                  : navigate('/dashboard/notifications')
              }
              className="relative rounded-lg border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400 dark:hover:bg-slate-700 dark:hover:text-gray-200"
            >
              <Bell className="h-4 w-4" />
              {hasAlerts && (
                <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-800" />
                </span>
              )}
            </button>

            {/* User avatar */}
            <button
              type="button"
              onClick={() => navigate('/dashboard/profile')}
              aria-label="Go to profile"
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 transition hover:bg-gray-100 hover:border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <UserCircle className="h-6 w-6 text-green-600" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-gray-900 leading-none dark:text-gray-100">{user?.fullName}</p>
                <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{user?.email}</p>
              </div>
            </button>
          </div>
        </motion.header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* FarmVerse AI — floating assistant, available on every dashboard */}
      <FarmVerseAIWidget />
    </div>
  );
};
