export const MENU_ACCESS = {
  ADMIN: ['accueil', 'comptes', 'paiements', 'paiements-traites', 'profil'],
  OPERATION: ['accueil', 'paiements', 'paiements-traites', 'profil'],
  COMMERCIAL: ['accueil', 'comptes', 'paiements', 'paiements-traites', 'profil'],
  COMPTABILITE: ['accueil', 'comptes', 'paiements', 'paiements-traites', 'profil'],
};

const PROCESS_ROLES = ['ADMIN', 'OPERATION'];

export function canAccessMenu(role, menu) {
  return (MENU_ACCESS[role] || []).includes(menu);
}

export function canProcessPayment(role) {
  return PROCESS_ROLES.includes(role);
}
