import { CircularProgress } from '@material-ui/core';
import { useEffect, useState, useMemo } from 'react';
import { locationsDistance } from './DistanceCalc'
import { activeCategories, placeDataRecoil, placeLoading, userPosition } from '../atoms';
import { useRecoilValue } from 'recoil';
import { boilerPlate } from './boilerPlate';

const Results = () => {

    const userCoords = useRecoilValue(userPosition)
    const loading = useRecoilValue(placeLoading)
    const categories = useRecoilValue(activeCategories)
    const placeDataOriginal = useRecoilValue(placeDataRecoil)
    const [filteredPlaces, setFilteredPlaces] = useState([])

    const memoPlaceData = useMemo(() => {
        return [...placeDataOriginal]
    }, [placeDataOriginal]);

    const nearestPlaces = () => {
        if (categories.length === 1 && categories.includes('Nearby')) {
            let nearList = (locationsDistance([...placeDataOriginal], userCoords?.latitude, userCoords?.longitude))
            return nearList
        } else if (categories.includes('Nearby')) {
            let nearList = (locationsDistance([...filteredPlaces], userCoords?.latitude, userCoords?.longitude))
            return nearList
        }
    }

    const memoMap = useMemo(() => {
        return new Map([
            ['Restaurants', 'restaurant'],
            ['Hotels', 'lodging'],
            ['Cafes', 'cafe'],
            ['Landmarks', 'tourist_attraction'],
            ['Most Reviewed', 'reviewed'],
            ['Bars', 'bar'],
            ['Retail', ["department_store", "supermarket", "furniture_store"]],
            ['Nearby', 'nearby']
        ])
    }, []);

    const mostReviewed = () => {
        if (categories.length === 1) {
            let mostReviewedList = [...placeDataOriginal]
                .sort((place1, place2) => place2.count - place1.count)
            return mostReviewedList

        } else {
            let mostReviewedList = [...filteredPlaces]
                .sort((place1, place2) => place2.count - place1.count)
            return mostReviewedList
        }
    }

    const SVGstyle = { display: 'block', margin: 'auto', padding: '50px' }

    useEffect(() => {
        setFilteredPlaces([])
        categories.forEach((category) => {
            if (category === "Retail") {
                memoMap.get('Retail').map((subCategory) => {
                    return (
                        setFilteredPlaces((prevState) => {
                            return [...prevState, ...memoPlaceData.filter((place) => place.extraData.types[0].includes(subCategory) || place.extraData.types[1].includes(subCategory))]
                        }))
                })
            } else {
                setFilteredPlaces((prevState) => {
                    return [...prevState, ...placeDataOriginal.filter((place) => place.extraData.types[0].includes(memoMap.get(category)) || place.extraData.types[1].includes(memoMap.get(category)))]
                })
            }
        })
        setFilteredPlaces(prevState => new Set(prevState))
        setFilteredPlaces(prevState => Array.from(prevState))
    }, [categories, memoMap, memoPlaceData, placeDataOriginal])

    return (
        <main className="container">
            {loading && <CircularProgress style={SVGstyle} />}

            {categories.length === 0
                && memoPlaceData
                    .sort((place1, place2) => place2.average - place1.average)
                    .map((item, index) => boilerPlate(item, index))}


            {Array.isArray(filteredPlaces) && !categories.includes("Most Reviewed")
                && !categories.includes("Nearby")
                ? filteredPlaces
                    .sort((place1, place2) => place2.average - place1.average)
                    .map((item, index) => boilerPlate(item, index)) : null}


            {categories.includes('Most Reviewed') && mostReviewed()
                .map((item, index) => boilerPlate(item, index))}

            {categories.includes("Nearby") && nearestPlaces()
                .map((item, index) => boilerPlate(item, index))}
        </main >
    )
}

export default Results;

