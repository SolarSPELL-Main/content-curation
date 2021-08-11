import { updateCRUDPermissions, createCRUDPermissions } from './utils';
import type { CRUD } from './types';

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
