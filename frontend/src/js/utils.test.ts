import { updateCRUDPermissions } from './utils';
import type { CRUD } from './types';

describe('checking CRUD permissions are updated appropriately', () => {
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

  test('original CRUD is not mutated by updates', () => {
    expect(crud).toMatchObject(<CRUD>{
      create: false,
      read: false,
      update: false,
      delete: false,
    });
  });
});
