import { useRef, useEffect } from "react"

//Importing from outside the project
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

//Importing from other files in the project
import type { RootState, Dispatch } from './state/store'

export const useCCDispatch = () => useDispatch<Dispatch>()
export const useCCSelector: TypedUseSelectorHook<RootState> = useSelector

export function usePrevious<T>(value: T): T {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref: any = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
