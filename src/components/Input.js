import { useState, useEffect } from 'react';
import Rating from '@material-ui/lab/Rating';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Autocomplete from 'react-google-autocomplete';
import db from '../firebase';
import firebase from 'firebase/app'
import { CircularProgress } from '@material-ui/core';

const Input = ({ placeData }) => {

    const [place, setPlace] = useState('');
    const [county, setCounty] = useState('');
    const [rating, setRating] = useState('')
    const [rank, setRank] = useState('')
    const [loadingPlace, setLoadingPlace] = useState(false)
    const [searchActivated, setSearchActivated] = useState(false)
    const [placeError, setPlaceError] = useState(false)
    const [adheranceRating, setAdheranceRating] = useState(0);
    const [cleanRating, setCleanRating] = useState(0);
    const [staffRating, setStaffRating] = useState(0);
    const [userComment, setInput] = useState([]);
    const [date, setDate] = useState('');


    useEffect(() => {
        setRank('')
        setRating('')
        placeData.forEach((item, index) => {
            if (place && place.name.toUpperCase() === item.place) {
                setRating(((item.accumRating / 3) / item.count).toFixed(1))
                setRank(parseInt(index))
            }
        })
    }, [place, placeData])



    const searchAutoComplete = <Autocomplete
        apiKey={'AIzaSyBhcUiOcSbio-KNInHy-n3sUoCFtjMyL1c'}
        placeholder={"Search Hotels, Restaurants, Landmarks..."}
        onPlaceSelected={async (place) => {
            try {
                console.log(place)
                const id = place.place_id
                const proxyurl = "https://young-basin-20621.herokuapp.com/";
                const url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + id + "&key=AIzaSyBhcUiOcSbio-KNInHy-n3sUoCFtjMyL1c"; // site that doesn’t send Access-Control-*
                setLoadingPlace(true)
                setSearchActivated(true)
                const response = await fetch(proxyurl + url)
                const data = await response.json()
                setPlace(data.result)
                setLoadingPlace(false)
                place.address_components.forEach((item2) => {
                    if (item2.types.includes("administrative_area_level_1")) {
                        console.log(item2.long_name)
                        setCounty(item2.long_name)
                    } else {
                        if (item2.types.includes("administrative_area_level_2")) {
                            console.log(item2.long_name)
                            setCounty(item2.long_name)
                        }
                    }
                })
            } catch (error) {
                console.log(error)
                setLoadingPlace(false)
                setPlaceError(true)
            }
        }}
        types={['establishment']}
        componentRestrictions={{ country: ["irl", "esp"] }}
    />

    const handleReset = () => {
        document.querySelectorAll('input').forEach(input => (input.value = ""));
        setPlace(''); setDate(''); setAdheranceRating(0); setCleanRating(0); setStaffRating(0); setInput('')
    }

    async function onUpload() {
        if (place) {
            setSearchActivated(false)
            const reviewsRef = db.collection('reviews')
            const snap = await reviewsRef.where('place', '==', place.name.toUpperCase()).get();

            if (!snap.empty) {
                // Logic to add to document
                snap.forEach(doc => {
                    console.log(doc.id)
                    db.collection('reviews').doc(doc.id).update({
                        cleanRating: (parseInt(doc.data().cleanRating) + parseInt(cleanRating)),
                        adheranceRating: parseInt(doc.data().adheranceRating) + parseInt(adheranceRating),
                        staffRating: parseInt(doc.data().staffRating) + parseInt(staffRating),
                        average: ((((doc.data().accumRating) / 3) + ((parseInt(cleanRating) + parseInt(adheranceRating) + parseInt(staffRating)) / 3)) / parseInt(doc.data().count + 1)),
                        accumRating: parseInt(doc.data().accumRating) + ((parseInt(cleanRating) + parseInt(adheranceRating) + parseInt(staffRating))),
                        userComment: doc.data().userComment.concat(userComment),
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        count: parseInt(doc.data().count + 1)
                        // (parseInt(doc.data().average) / (parseInt(doc.data().count) + 1))
                        // + ((parseInt(cleanRating) + parseInt(adheranceRating) + parseInt(staffRating)) / 3) / (parseInt(doc.data().count) + 1)
                    })
                })
                return;
            }
        }



        if (place !== "" && cleanRating !== 0 && adheranceRating !== 0 && staffRating !== 0) {
            db.collection('reviews').add({
                place: place.name.toUpperCase(),
                date: date,
                cleanRating: parseInt(cleanRating),
                adheranceRating: parseInt(adheranceRating),
                staffRating: parseInt(staffRating),
                accumRating: ((parseInt(cleanRating) + parseInt(adheranceRating) + parseInt(staffRating))),
                userComment: userComment,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                viewComment: false,
                extraData: place,
                count: 1,
                county: county,
                average: ((parseInt(cleanRating) + parseInt(staffRating) + parseInt(adheranceRating)) / 3)
            })
        }
    }

    return (
        <section className='Input'>

            <div className="search">
                {searchAutoComplete}
                <button onClick={() => { onUpload(); handleReset(); }}>Upload</button>
            </div>

            {placeError && <div className="apiError"><h3><span>⚠️ Warning - </span>Error loading place information.</h3></div>}
            {loadingPlace && <div className="place-spinner"><CircularProgress /></div>}

            {!loadingPlace && searchActivated &&
                <section className="spotlight-info">
                    <article className="left">
                        <h4 className="place-name">{place.name}</h4>
                        {
                            rating ?
                                <p>Rating:  <span className="place-rating">
                                    {rating}
                                </span></p>
                                :
                                <p>Rating: <span className="place-rating">N/A</span></p>
                        }

                        {typeof rank === 'number' ? <p>Ranking:  <span className="place-ranking">#{rank + 1}</span></p> : <p>Ranking:  <span className="place-ranking">N/A</span></p>}
                    </article>

                    <article className="right">
                        <p>Cleanliness:
                            <span>
                                <Rating
                                    name="clean"
                                    value={Number(cleanRating)}
                                    onChange={(event) => setCleanRating(event.target.value)}
                                    icon={<FiberManualRecordIcon />}
                                />
                            </span>
                        </p>


                        <p>Adherance:
                            <span>
                                <Rating
                                    name="adherance"
                                    value={Number(adheranceRating)}
                                    onChange={(event) => setAdheranceRating(event.target.value)}
                                    icon={<FiberManualRecordIcon />}
                                />
                            </span>
                        </p>


                        <p>Staff:
                            <span>
                                <Rating
                                    name="staff"
                                    value={Number(staffRating)}
                                    onChange={(event) => setStaffRating(event.target.value)}
                                    icon={<FiberManualRecordIcon />}
                                />
                            </span>
                        </p>

                    </article>
                </section>}
        </section>

    )
}

export default Input;