import { createSlice } from '@reduxjs/toolkit'
import { current } from 'immer'

export const chipSlice = createSlice({
    name: 'counter',
    initialState: {
        values: {
            Restaurants: { id: 0, category: "Restaurants", active: false, google_name: 'rest' },
            Hotels: { id: 1, category: "Hotel", active: false, google_name: 'lodging' },
            Landmarks: { id: 2, category: "Landmarks", active: false, google_name: 'landmark' },
            'Most Reviewed': { id: 3, category: "Most Reviewed", active: false, google_name: 'reviewed' },
            Bars: { id: 4, category: "Bars", active: false, google_name: 'bar' },
            Retail: { id: 5, category: "Retail", active: false, google_name: 'retail' },
            Nearby: { id: 6, category: "Nearby", active: false, google_name: 'nearby' }
        },
        activeCats: []
    },

    reducers: {
        onSelect: (state, action) => {
            let newArr = [];
            state.values[action.payload].active = true

            newArr = [...state.activeCats, action.payload]
            newArr = [...new Set(newArr)]
            state.activeCats = newArr

            if (action.payload === "Nearby") {
                state.values["Most Reviewed"].active = false
                state.activeCats = state.activeCats.filter((item) => item !== "Most Reviewed")
            } else if (action.payload === "Most Reviewed") {
                state.values["Nearby"].active = false
                state.activeCats = state.activeCats.filter((item) => item !== "Nearby")
            }
        },
        onRemove: (state, action) => {
            state.values[action.payload].active = false
            let newArr = state.activeCats.filter((item) => item !== action.payload)
            state.activeCats = newArr
        }
    }
})

export const { onSelect, onRemove } = chipSlice.actions

export default chipSlice.reducer