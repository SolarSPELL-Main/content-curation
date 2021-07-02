//Importing from outside the project
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

//Importing from other files in the project
import type { RootState, Dispatch } from './state/store'

export const useCCDispatch = () => useDispatch<Dispatch>()
export const useCCSelector: TypedUseSelectorHook<RootState> = useSelector
