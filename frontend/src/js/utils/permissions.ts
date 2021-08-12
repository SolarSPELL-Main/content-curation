import type { CRUD, Permissions } from 'js/types';

/**
 * Updates a CREATE/READ/UPDATE/DELETE permissions object.
 * Updates only if the field would become true, otherwise leaves it as is.
 * @param crud The CRUD permissions object to update.
 * @param permissions Should be some subset of 'C', 'R', 'U', and 'D'.
 * @returns A CRUD object.
 */
export const updateCRUDPermissions = (
  crud: CRUD,
  permissions: string,
): CRUD => {
  const newCrud = Object.assign({}, crud);
  
  if (permissions.includes('C')) {
    newCrud.create = true;
  }
  if (permissions.includes('R')) {
    newCrud.read = true;
  }
  if (permissions.includes('U')) {
    newCrud.update = true;
  }
  if (permissions.includes('D')) {
    newCrud.delete = true;
  }
  
  return newCrud;
};
  
/**
 * Creates a CREATE/READ/UPDATE/DELETE permissions object.
 * @param permissions Should be some subset of 'C', 'R', 'U', and 'D'.
 * @returns A CRUD object.
 */
export const createCRUDPermissions = (
  permissions?: string,
): CRUD => {
  const crud: CRUD = {
    create: false,
    read: false,
    update: false,
    delete: false,
  };
  
  if (permissions) {
    return updateCRUDPermissions(crud, permissions);
  } else {
    return crud;
  }
};

/** Union of permission subtypes within Permissions type */
type PermType = Permissions[keyof Permissions];

/**
 * Checks if permissions object includes this permission.
 * @param permissions The permissions object.
 * @param slice Which slice to check.
 * @param permission The specific CRUD permission.
 * @param mode If permission is an array, whether to check every single
 *             permission is present, or only if some are present.
 * @returns Whether the permissions object includes that permission.
 */
export const hasPermission = (
  permissions: Permissions,
  slice: keyof Permissions,
  permission: string|string[],
  mode: 'every'|'some'='every',
): boolean => {
  if (Array.isArray(permission)) {
    if (mode === 'every') {
      return permission.every(p => permissions[slice][p as keyof PermType]);
    } else {
      return permission.some(p => permissions[slice][p as keyof PermType]);
    }
  } else {
    return permissions[slice][permission as keyof PermType];
  }
};
