import { from, of, concat } from 'rxjs';
import { filter, map, mergeMap, mapTo, delay } from 'rxjs/operators';

import {
    fetch_user,
    update_user,
    show_toast,
    close_toast,
    logout,
    start_loader,
    stop_loader,
} from '../global';

import APP_URLS from '../../urls';
import { api } from '../../utils';

import type { MyEpic } from './types';

const fetchUserEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_user.match),
        mergeMap(_ =>
            concat(
                of(start_loader()),
                from(api.get(APP_URLS.USER_INFO)).pipe(
                    map(({ data }) => update_user(data.data)),
                ),
                of(stop_loader()),
            ),
        ),
    )

const logoutEpic: MyEpic = action$ =>
    action$.pipe(
        filter(logout.match),
        mergeMap(_ =>
            from(api.post(APP_URLS.LOGOUT)).pipe(
                mapTo(fetch_user())
            )
        )
    )

const showToastEpic: MyEpic = action$ =>
    action$.pipe(
        filter(show_toast.match),
        filter(action => action.payload.severity !== 'error'),
        delay(6000),
        map(action => close_toast(action.payload.key)),
    )

export {
    fetchUserEpic,
    logoutEpic,
    showToastEpic,
}
