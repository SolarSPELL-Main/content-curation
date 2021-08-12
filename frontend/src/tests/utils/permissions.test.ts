import {
  updateCRUDPermissions,
  createCRUDPermissions,
  hasPermission,
} from 'js/utils/permissions';
import type { CRUD, Permissions } from 'js/types';

describe('CRUD permissions should be updated appropriately', () => {
  const crud: CRUD = {
    create: false,
    read: false,
    update: false,
    delete: false,
  };

  test.each([
    ['', {
      create: false,
      read: false,
      update: false,
      delete: false,
    }],
    ['CCCCC', {
      create: true,
      read: false,
      update: false,
      delete: false,
    }],
    ['DU', {
      create: false,
      read: false,
      update: true,
      delete: true,
    }],
    ['CRUD', {
      create: true,
      read: true,
      update: true,
      delete: true,
    }],
  ])('.updateCRUDPermissions(%s)', (str: string, expectedCrud: CRUD) => {
    const newCrud = updateCRUDPermissions(crud, str);
    expect(newCrud).toMatchObject(expectedCrud);
  });

  test('updating does not flip true permissions to false', () => {
    const trueCrud: CRUD = {
      create: true,
      read: true,
      update: true,
      delete: true,
    };
    const newCrud = updateCRUDPermissions(trueCrud, 'CRUD');
    expect(newCrud).toMatchObject(trueCrud);
  });

  test('original CRUD is not mutated by updates', () => {
    expect(crud).toMatchObject(<CRUD>{
      create: false,
      read: false,
      update: false,
      delete: false,
    });
  });
});

describe('CRUD permissions should be created appropriately', () => {
  test.each([
    ['', {
      create: false,
      read: false,
      update: false,
      delete: false,
    }],
    ['CCCCC', {
      create: true,
      read: false,
      update: false,
      delete: false,
    }],
    ['DU', {
      create: false,
      read: false,
      update: true,
      delete: true,
    }],
    ['CRUD', {
      create: true,
      read: true,
      update: true,
      delete: true,
    }],
  ])('.createCRUDPermissions(%s)', (str: string, expectedCrud: CRUD) => {
    const newCrud = createCRUDPermissions(str);
    expect(newCrud).toMatchObject(expectedCrud);
  });
});
  
describe('user permissions should be checked correctly', () => {
  const permissions: Permissions = {
    content: {
      create: false,
      read: false,
      update: false,
      delete: true,
    },
    metadata: {
      create: true,
      read: true,
      update: true,
      delete: false,
    },
    special: {
      admin: true,
      export: false,
      review: false,
    },
  };
  
  test.each([
    ['content', ['create', 'read', 'update', 'delete'], 'some', true],
    ['content', ['create', 'read', 'update', 'delete'], 'every', false],
    ['content', ['delete'], 'every', true],
    ['metadata', ['create', 'read', 'update', 'delete'], 'some', true],
    ['metadata', ['create', 'read', 'update', 'delete'], 'every', false],
    ['metadata', ['create', 'read', 'update'], 'every', true],
    ['special', ['admin', 'export', 'review'], 'some', true],
    ['special', ['admin', 'export', 'review'], 'every', false],
    ['content', 'create', undefined, false],
    ['content', 'read', undefined, false],
    ['content', 'update', undefined, false],
    ['content', 'delete', undefined, true],
    ['metadata', 'create', undefined, true],
    ['metadata', 'read', undefined, true],
    ['metadata', 'update', undefined, true],
    ['metadata', 'delete', undefined, false],
    ['special', 'admin', undefined, true],
    ['special', 'export', undefined, false],
    ['special', 'review', undefined, false],
  ])('.hasPermission(%s, %o, %s)', (slice, perms, mode, expected) => {
    const permitted = hasPermission(
      permissions,
      slice as keyof Permissions,
      perms,
      mode as 'some'|'every',
    );
    expect(permitted).toBe(expected);
  });
});
