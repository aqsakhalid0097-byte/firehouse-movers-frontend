import type { AuthUser, UserRole } from '../api/types';

/**
 * All 13 Internal Staff Roles in Firehouse Movers
 */
export const INTERNAL_STAFF_ROLES = [
  'ceo',
  'vp',
  'admin',
  'manager',
  'driver',
  'mover',
  'sales',
  'warehouse',
  'technician',
  'field',
  'llc/field',
  'llc/owner',
  'rwh',
] as const;

export type InternalStaffRole = (typeof INTERNAL_STAFF_ROLES)[number];

/**
 * Manager & Executive Roles ("IsManager" / Manager or above)
 * Allowed: ceo, vp, admin, manager, llc/owner
 */
export const MANAGER_ROLES = [
  'ceo',
  'vp',
  'admin',
  'manager',
  'llc/owner',
] as const;

/**
 * Dispatcher & Management Roles (Restricted for drivers, movers, and customers)
 * Allowed: ceo, vp, admin, manager, llc/owner
 */
export const DISPATCHER_ROLES = [
  'ceo',
  'vp',
  'admin',
  'manager',
  'llc/owner',
] as const;

/**
 * Gift Card Management Roles (Issuing & adding cards)
 * Allowed: ceo, vp, admin, manager
 */
export const CARD_MANAGEMENT_ROLES = [
  'ceo',
  'vp',
  'admin',
  'manager',
] as const;

/**
 * Normalizes any role string or user object role representation to a lowercase slug.
 * Examples:
 * - "LLC / Owner" -> "llc/owner"
 * - "llc_owner" -> "llc/owner"
 * - "llc_field" -> "llc/field"
 * - "Vice President" -> "vp"
 * - "Administrator" -> "admin"
 */
export function normalizeRole(rawRole?: string | null): string {
  if (!rawRole) return '';

  const clean = rawRole.trim().toLowerCase().replace(/\s*\/\s*/g, '/');

  if (clean === 'llc/owner' || clean === 'llc_owner' || clean === 'llc owner' || clean === 'llc-owner' || clean === 'owner') {
    return 'llc/owner';
  }
  if (clean === 'llc/field' || clean === 'llc_field' || clean === 'llc field' || clean === 'llc-field') {
    return 'llc/field';
  }
  if (clean === 'admin' || clean === 'administrator' || clean === 'superadmin') {
    return 'admin';
  }
  if (clean === 'vp' || clean === 'vice president' || clean === 'vice_president' || clean === 'vice-president') {
    return 'vp';
  }
  if (clean === 'ceo' || clean === 'chief executive officer') {
    return 'ceo';
  }
  if (clean === 'manager' || clean === 'general manager' || clean === 'operations manager') {
    return 'manager';
  }
  if (clean === 'driver' || clean === 'lead driver' || clean === 'truck driver') {
    return 'driver';
  }
  if (clean === 'mover' || clean === 'crew lead' || clean === 'crew member') {
    return 'mover';
  }
  if (clean === 'sales' || clean === 'sales representative' || clean === 'estimator') {
    return 'sales';
  }
  if (clean === 'warehouse' || clean === 'warehouse associate' || clean === 'warehouse manager') {
    return 'warehouse';
  }
  if (clean === 'technician' || clean === 'fleet technician' || clean === 'mechanic') {
    return 'technician';
  }
  if (clean === 'field' || clean === 'field supervisor' || clean === 'field crew') {
    return 'field';
  }
  if (clean === 'rwh' || clean === 'regional warehouse') {
    return 'rwh';
  }
  if (clean === 'customer' || clean.includes('customer')) {
    return 'customer';
  }

  return clean;
}

/**
 * Extracts and normalizes the active role slug for a user.
 */
export function getUserRoleSlug(user?: AuthUser | null): string {
  if (!user) return '';

  if (user.is_superuser) return 'admin';

  if (typeof user.role === 'string') {
    return normalizeRole(user.role);
  }

  if (typeof user.role === 'object' && user.role !== null) {
    const roleObj = user.role as UserRole;
    if (roleObj.is_customer) return 'customer';
    if (roleObj.name) {
      const normalized = normalizeRole(roleObj.name);
      if (normalized) return normalized;
    }
    if (roleObj.is_admin) return 'admin';
    if (roleObj.is_senior_management) return 'vp';
    if (roleObj.is_manager) return 'manager';
    if (roleObj.is_driver) return 'driver';
    if (roleObj.is_mover) return 'mover';
    if (roleObj.is_employee) return 'mover';
  }

  if ((user as any).is_customer) return 'customer';
  if (user.is_staff) return 'admin';

  return 'mover';
}

/**
 * Checks if user has "IsManager" permissions (Manager or above: ceo, vp, admin, manager, llc/owner).
 */
export function isManager(user?: AuthUser | null): boolean {
  if (!user) return false;
  if (user.is_superuser) return true;

  if (typeof user.role === 'object' && user.role !== null) {
    const roleObj = user.role as UserRole;
    if (roleObj.is_customer) return false;
    if (roleObj.is_admin || roleObj.is_manager || roleObj.is_senior_management) {
      return true;
    }
  }

  const slug = getUserRoleSlug(user);
  return (MANAGER_ROLES as readonly string[]).includes(slug);
}

/**
 * Checks if user is an Internal Staff member (All 13 internal roles, non-customer).
 */
export function isInternalStaff(user?: AuthUser | null): boolean {
  if (!user) return false;
  if (user.is_superuser) return true;

  if (typeof user.role === 'object' && user.role !== null) {
    const roleObj = user.role as UserRole;
    if (roleObj.is_customer) return false;
  }
  if ((user as any).is_customer) return false;

  const slug = getUserRoleSlug(user);
  if (slug === 'customer') return false;

  return (INTERNAL_STAFF_ROLES as readonly string[]).includes(slug as any) || user.is_staff === true;
}

/**
 * Checks if user has Dispatcher permissions (Management / Dispatchers: ceo, vp, admin, manager, llc/owner).
 * Drivers, movers, and customers are strictly restricted.
 */
export function isDispatcher(user?: AuthUser | null): boolean {
  if (!user) return false;
  if (user.is_superuser) return true;

  if (typeof user.role === 'object' && user.role !== null) {
    const roleObj = user.role as UserRole;
    if (roleObj.is_customer || roleObj.is_driver || roleObj.is_mover) {
      return false;
    }
    if (roleObj.is_admin || roleObj.is_manager || roleObj.is_senior_management) {
      return true;
    }
  }

  const slug = getUserRoleSlug(user);
  if (slug === 'driver' || slug === 'mover' || slug === 'customer') {
    return false;
  }

  return (DISPATCHER_ROLES as readonly string[]).includes(slug);
}

/**
 * Checks if user has permission to issue or add gift cards (Management & Admin only: ceo, vp, admin, manager).
 */
export function canManageGiftCards(user?: AuthUser | null): boolean {
  if (!user) return false;
  if (user.is_superuser) return true;

  if (typeof user.role === 'object' && user.role !== null) {
    const roleObj = user.role as UserRole;
    if (roleObj.is_customer) return false;
    if (roleObj.is_admin || roleObj.is_manager || roleObj.is_senior_management) {
      return true;
    }
  }

  const slug = getUserRoleSlug(user);
  return (CARD_MANAGEMENT_ROLES as readonly string[]).includes(slug);
}
