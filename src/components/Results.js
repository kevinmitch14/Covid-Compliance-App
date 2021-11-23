import Comment from '../components/Comment'
import { CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { locationsDistance } from './DistanceCalc'

const Results = ({ placeData, loading }) => {

    const [lat, setLat] = useState(null)
    const [long, setLong] = useState(null)



    const SVGstyle = { display: 'block', margin: 'auto', padding: '50px' }
    const state = useSelector(state => state.chip)
    const [filteredPlaces, setFilteredPlaces] = useState([])

    const dict = {
        'Restaurants': ['restaurant', 'food'],
        'Hotels': 'lodging',
        'Landmarks': 'tourist_attraction',
        'Most Reviewed': 'reviewed',
        'Bars': 'bar',
        'Retail': ["furniture_store", "department_store", "supermarket"],
        'Nearby': 'nearby'
    }

    const chipFilter = useRef(() => { })

    chipFilter.current = () => {
        state.activeCats.includes("Nearby") && navigator.geolocation.getCurrentPosition((position) => {
            setLat(position.coords.latitude)
            setLong(position.coords.longitude)
        })
        state.activeCats.forEach((item) => {

            let placeType = dict[item]
            let filteredPlacesPlaces = placeData.filter((item) => placeType.includes(item.extraData.types[0]) || placeType.includes(item.extraData.types[1]))
            setFilteredPlaces(prevState => [...prevState, ...filteredPlacesPlaces])
        })
    }

    useEffect(() => {
        chipFilter.current()
        return () => {
            setFilteredPlaces([])
        }
    }, [state.activeCats])

    const boilerPlate = (item, index) => (
        <article className='result-card' key={index}>

            <div className="name">
                <p id="card-name">{item.place}</p>
                <p id="card-county">{item.county}</p>
            </div>

            <div className="rating">
                <span id="first">{(Math.floor(Math.round(((item.accumRating / 3) / item.count) * 10) / 10))}.</span><span id="last">{Math.round(((Math.round(((item.accumRating / 3) / item.count) * 10) / 10) - Math.floor(Math.round(((item.accumRating / 3) / item.count) * 10) / 10).toFixed()) * 10)}</span>
            </div>

            <div className="reviews">
                {item.count > 1 ? <span>{item.count} reviews</span> : <span>{item.count} review</span>}
            </div>

            <Comment
                cleanRating={Math.round(item.cleanRating / item.count * 10) / 10}
                staffRating={Math.round(item.staffRating / item.count * 10) / 10}
                adheranceRating={Math.round(item.adheranceRating / item.count * 10) / 10}
                extraData={item.extraData}
            />
        </article >
    )


    const resultsList =

        // No filter
        state.activeCats.length === 0 ? placeData.sort((a, b) => (a.average < b.average) ? 1 : -1)
            .map((item, index) => boilerPlate(item, index)) :

            // Most Reviewed and another filter
            state.activeCats.includes("Most Reviewed") && filteredPlaces.length > 0 ?
                filteredPlaces.sort((a, b) => (a.count < b.count) ? 1 : -1)
                    .map((item, index) => boilerPlate(item, index)) :

                // Just most reviewed
                state.activeCats.includes("Most Reviewed") ?

                    placeData.sort((a, b) => (a.count < b.count) ? 1 : -1)
                        .map((item, index) => boilerPlate(item, index)) :

                    // Nearby and another
                    state.activeCats.includes("Nearby") && filteredPlaces.length > 0 ?
                        locationsDistance(filteredPlaces, lat, long).sort((a, b) => (a.distance > b.distance) ? 1 : -1)
                            .map((item, index) => boilerPlate(item, index)) :

                        // Just nearby
                        state.activeCats.includes("Nearby") ?
                            locationsDistance(placeData, lat, long).sort((a, b) => (a.distance > b.distance) ? 1 : -1)
                                .map((item, index) => boilerPlate(item, index)) :

                            state.activeCats.length !== 0 ? filteredPlaces.sort((a, b) => (a.average < b.average) ? 1 : -1)

                                .map((item, index) => boilerPlate(item, index)) : null

    return (
        <main className="container">
            {loading && <CircularProgress style={SVGstyle} />}
            {placeData ? resultsList : <p id="empty-message">No entries yet!</p>}
        </main >
    )
}

export default Results;

