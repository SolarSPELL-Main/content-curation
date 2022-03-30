import type { AnyAction } from '@reduxjs/toolkit';

import { of, concat, ObservableInput, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  show_toast,
  start_loader,
  stop_loader,
  clear_loaders,
} from '../global';

import type { MyEpic } from './types';

/*
 * Wraps a decorator such that whenever an error is thrown it logs to console
 * error, and outputs an error toast action
 */
const errorCatcher = (epic: MyEpic): MyEpic => (...args: Parameters<MyEpic>) =>
  epic(...args).pipe(
    catchError((error, source) => {
    //  console.error(error);
      return concat(
        of(show_toast({
          message: `${error.name} - ${error.message}`,
          key: Math.random(),
          severity: 'error',
        })),
        of(clear_loaders()),
        source
      );
    })
  );

/*
 * Wraps an observable with actions that add a key to the loader collection and
 * later remove that key
 */
const fromWrapper = (
  obs: ObservableInput<AnyAction>,
  onFinish?: AnyAction,
): Observable<AnyAction> => {
  const key = Date.now();

  return concat(...[
    of(start_loader(key)),
    obs,
    ...(onFinish ? [of(onFinish)] : []),
    of(stop_loader(key)),
  ]);
};

export {
  errorCatcher,
  fromWrapper,
};
