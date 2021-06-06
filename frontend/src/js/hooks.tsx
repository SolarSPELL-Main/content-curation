import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, Dispatch } from './state/store'

export const useCCDispatch = () => useDispatch<Dispatch>()
export const useCCSelector: TypedUseSelectorHook<RootState> = useSelector
