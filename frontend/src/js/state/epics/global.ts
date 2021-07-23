import { from } from 'rxjs';
import { filter, map, mergeMap, mapTo, delay } from 'rxjs/operators';

import {
    fetch_user,
    update_user,
    show_toast,
    close_toast,
    logout,
} from '../global';

import { fromWrapper } from './util';
import APP_URLS from '../../urls';
import { api } from '../../utils';

import type { MyEpic } from './types';

const fetchUserEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_user.match),
        mergeMap(_ =>
            fromWrapper(from(api.get(APP_URLS.USER_INFO)).pipe(
                map(({ data }) => update_user(data.data)),
            )),
        ),
    )

const logoutEpic: MyEpic = action$ =>
    action$.pipe(
        filter(logout.match),
        mergeMap(_ =>
            fromWrapper(from(api.post(APP_URLS.LOGOUT)).pipe(
                mapTo(fetch_user())
            ))
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
