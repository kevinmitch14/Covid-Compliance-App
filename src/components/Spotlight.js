import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { placeDataRecoil, selectedPlace } from "../atoms"

const Spotlight = () => {
    const [rating, setRating] = useState(null)
    const [rank, setRank] = useState(null)
    const place = useRecoilValue(selectedPlace)
    const placeData = useRecoilValue(placeDataRecoil)


    useEffect(() => {
        setRank(null)
        setRating(null)
        placeData.forEach((item, index) => {
            if (place && place.name.toUpperCase() === item.place) {
                setRating(((item.accumRating / 3) / item.count).toFixed(1))
                setRank(parseInt(index))
            }
        })
    }, [place, placeData])

    return (
        <article className="left">
            <h4 className="place-name">{place.name}</h4>
            {
                rating ?
                    <p>Rating: <span className="place-rating">
                        {rating}
                    </span></p>
                    :
                    <p>Rating: <span className="place-rating">N/A</span></p>
            }

            {typeof rank === 'number' ? <p>Ranking: <span className="place-ranking">#{rank + 1}</span></p> : <p>Ranking: <span className="place-ranking">N/A</span></p>}
        </article>
    )
}

export default Spotlight
