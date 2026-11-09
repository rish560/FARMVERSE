export const roleRoutes = {
  GUEST: '/dashboard',
  FARM_MANAGER: '/dashboard',
  ADMIN: '/dashboard',
};

export const normalizeRole = (role = '') => {
  if (!role || typeof role !== 'string') return '';
  let normalized = role.trim().toUpperCase().replace(/\s+/g, '_');
  if (normalized.startsWith('ROLE_')) {
    normalized = normalized.substring(5);
  }
  const map = {
    GUEST: 'GUEST',
    GUESTS: 'GUEST',
    GUEST_USER: 'GUEST',
    'GUEST USER': 'GUEST',
    FARM_MANAGER: 'FARM_MANAGER',
    FARM_MANAGERS: 'FARM_MANAGER',
    'FARM MANAGER': 'FARM_MANAGER',
    MANAGER: 'FARM_MANAGER',
    ADMIN: 'ADMIN',
    ADMINISTRATOR: 'ADMIN',
  };
  return map[normalized] || normalized;
};

export const roleHomeRoute = (role) => roleRoutes[normalizeRole(role)] || '/login';