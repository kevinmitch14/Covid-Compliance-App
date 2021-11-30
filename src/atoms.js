import { atom } from 'recoil'

export const cleanRatingRecoil = atom({
    key: 'clean',
    default: 0
})
export const staffRatingRecoil = atom({
    key: 'staff',
    default: 0
})
export const adheranceRatingRecoil = atom({
    key: 'adherance',
    default: 0
})

export const selectedPlace = atom({
    key: 'selectedPlace',
    default: null
})

export const placeLoading = atom({
    key: 'loadingPlace',
    default: false
})

export const placeDataRecoil = atom({
    key: 'placeData',
    default: []
})

export const activeCategories = atom({
    key: 'activeCats',
    default: []
})

export const userPosition = atom({
    key: 'userPosition',
    default: null
})