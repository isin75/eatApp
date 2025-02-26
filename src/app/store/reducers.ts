// reducers/index.ts
import { combineReducers } from 'redux'
import orderReducer from './orderSlice'

const rootReducer = combineReducers({
	order: orderReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
