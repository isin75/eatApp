import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Order = {
	id: string
	title: string
	count: number
}

interface OrderState {
	order: Order[] | []
}

const initialState: OrderState = {
	order: [],
}

export const orderSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		addItem: (state, action: PayloadAction<Order>) => {
			const existingItem = state.order.find(
				item => item.id === action.payload.id
			)

			if (existingItem) {
				existingItem.count = action.payload.count
			} else {
				state.order = [...state.order, action.payload]
			}
		},
		deletedItem: (state, action: PayloadAction<Order>) => {
			state.order = state.order.filter(
				item => item.title !== action.payload.title
			)
		},
		decrementItem: (state, action: PayloadAction<Order>) => {
			state.order = state.order.map(item =>
				item.id === action.payload ? { ...item, count: item.count - 1 } : item
			)
		},
		incrementItem: (state, action: PayloadAction<Order>) => {
			console.log(action.payload.id)

			state.order = state.order.map(item =>
				item.id === action.payload ? { ...item, count: item.count + 1 } : item
			)
		},
		clearCart: state => {
			state.order = []
		},
	},
})

export const { addItem, deletedItem, decrementItem, incrementItem, clearCart } =
	orderSlice.actions

export default orderSlice.reducer
