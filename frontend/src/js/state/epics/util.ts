import { from, of, concat } from 'rxjs'
import { catchError, finalize } from 'rxjs/operators';

import {
    show_toast,
    start_loader,
    stop_loader,
} from '../global';

import type { MyEpic } from './types';

const errorCatcher = (epic: MyEpic) => (...args: Parameters<MyEpic>) =>
    epic(...args).pipe(
        catchError((error, source) => {
            console.error(error)
            return concat(of(show_toast({
                message: `${error.name} - ${error.message}`,
                key: Math.random(),
                severity: "error"
            })), source)
        })
    )

const loadingFrom = <T>(promise: Promise<T>) => {
    of(
        start_loader(),
        from(promise),
    ).pipe(
        finalize(() => stop_loader()),
    )
}

export {
    errorCatcher,
    loadingFrom,
}
