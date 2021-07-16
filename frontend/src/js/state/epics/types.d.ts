import type { AnyAction } from '@reduxjs/toolkit';
import type { Epic } from 'redux-observable';

import type { MyState } from '../store';

type MyEpic = Epic<AnyAction, AnyAction, MyState>
