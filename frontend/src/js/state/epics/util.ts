import type { AnyAction } from '@reduxjs/toolkit';
import { of, concat, ObservableInput } from 'rxjs'
import { catchError } from 'rxjs/operators';

import {
    show_toast,
    start_loader,
    stop_loader,
    clear_loaders,
} from '../global';

import type { MyEpic } from './types';

const errorCatcher = (epic: MyEpic) => (...args: Parameters<MyEpic>) =>
    epic(...args).pipe(
        catchError((error, source) => {
            console.error(error)
            return concat(
                of(show_toast({
                    message: `${error.name} - ${error.message}`,
                    key: Math.random(),
                    severity: "error"
                })),
                of(clear_loaders()),
                source
            );
        })
    )

const fromWrapper = (obs: ObservableInput<AnyAction>, onFinish?: AnyAction) => {
    const key = Date.now();

    if (onFinish != null) {
        return concat(
            of(start_loader(key)),
            obs,
            of(onFinish),
            of(stop_loader(key)),
        );
    } else {
        return concat(
            of(start_loader(key)),
            obs,
            of(stop_loader(key)),
        );
    }
}

export {
    errorCatcher,
    fromWrapper,
}
