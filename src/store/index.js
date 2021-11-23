import { configureStore } from '@reduxjs/toolkit'
import chipSlice from '../slices/chips'


export default configureStore({
    reducer: {
        chip: chipSlice
    }
})