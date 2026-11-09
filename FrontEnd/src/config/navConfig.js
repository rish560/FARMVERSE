import { Bell, BarChart3, Calculator, FileText, Leaf, MapPin, Settings, ShieldCheck, Sparkles, Sprout, UserCircle, UserCog, Users, Wheat, Info, HelpCircle } from 'lucide-react';

const roles = { 
  admin: ['ADMIN'], 
  manager: ['FARM_MANAGER'],   // FARMER removed — not a valid role
  guest: ['GUEST', 'USER'] 
};

export const navConfig = [
  { to: '/dashboard', label: 'Dashboard', labelKey: 'dashboard', allowedRoles: [...roles.admin, ...roles.manager, ...roles.guest], section: 'Overview', icon: Sprout, color: 'emerald' },
  
  // Admin & Farm Manager actions
  { to: '/dashboard/add-farm', label: 'Add Farm', labelKey: 'addFarm', allowedRoles: [...roles.admin, ...roles.manager], section: 'Overview', icon: MapPin, color: 'teal' },
  
  // Admin User Sub-roles management (View Farmers removed)
  { to: '/dashboard/users', label: 'Manage Users', labelKey: 'manageUsers', allowedRoles: roles.admin, section: 'Management', icon: Users, color: 'violet' },
  { to: '/dashboard/admins', label: 'View Admins', labelKey: 'viewAdmins', allowedRoles: roles.admin, section: 'Management', icon: ShieldCheck, color: 'indigo' },
  { to: '/dashboard/farm-managers', label: 'View Farm Managers', labelKey: 'viewFarmManagers', allowedRoles: roles.admin, section: 'Management', icon: UserCog, color: 'blue' },
  { to: '/dashboard/guests', label: 'View Guests', labelKey: 'viewGuests', allowedRoles: roles.admin, section: 'Management', icon: Users, color: 'cyan' },
  
  // Farms and Crops
  { to: '/dashboard/farms', label: 'View Farms', labelKey: 'viewFarms', allowedRoles: [...roles.admin, ...roles.manager, ...roles.guest], section: 'Farm operations', icon: MapPin, color: 'green' },
  { to: '/dashboard/my-farms', label: 'My Farms', labelKey: 'myFarms', allowedRoles: roles.manager, section: 'Farm operations', icon: MapPin, color: 'teal' },
  { to: '/dashboard/crops', label: 'View Crops', labelKey: 'viewCrops', allowedRoles: [...roles.admin, ...roles.guest], section: 'Farm operations', icon: Wheat, color: 'amber' },
  { to: '/dashboard/production', label: 'My Crops', labelKey: 'myCrops', allowedRoles: roles.manager, section: 'Farm operations', icon: BarChart3, color: 'orange' },
  
  
  // Guest view pages
  { to: '/dashboard/help', label: 'Help', labelKey: 'help', allowedRoles: [...roles.admin, ...roles.manager, ...roles.guest], section: 'Information', icon: HelpCircle, color: 'sky' },
  { to: '/dashboard/ai-assistant', label: 'AI Assistant', labelKey: 'aiAssistant', allowedRoles: [...roles.admin, ...roles.manager, ...roles.guest], section: 'Information', icon: Sparkles, color: 'emerald' },
  { to: '/dashboard/expense-tracker', label: 'Expense Tracker', labelKey: 'expenseTracker', allowedRoles: [...roles.admin, ...roles.manager], section: 'Information', icon: Calculator, color: 'teal' },

  // Account
  { to: '/dashboard/notifications', label: 'Notifications', labelKey: 'notifications', allowedRoles: [...roles.admin, ...roles.manager], section: 'Account', icon: Bell, color: 'rose' },
  { to: '/dashboard/profile', label: 'Profile', labelKey: 'profile', allowedRoles: [...roles.admin, ...roles.manager, ...roles.guest], section: 'Account', icon: UserCircle, color: 'fuchsia' },
  { to: '/dashboard/settings', label: 'Settings', labelKey: 'settings', allowedRoles: [...roles.admin, ...roles.manager], section: 'Account', icon: Settings, color: 'slate' },
];