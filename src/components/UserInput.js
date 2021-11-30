import { doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from "@firebase/firestore";
import { adheranceRatingRecoil, cleanRatingRecoil, staffRatingRecoil, selectedPlace, placeLoading } from '../atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Autocomplete from 'react-google-autocomplete';

import db from '../firebase';
import { useState } from "react";

const UserInput = () => {

    const [county, setCounty] = useState(null);

    const [place, setPlace] = useRecoilState(selectedPlace)
    const setLoadingPlace = useSetRecoilState(placeLoading)

    const [cleanRating, setCleanRating] = useRecoilState(cleanRatingRecoil)
    const [staffRating, setStaffRating] = useRecoilState(staffRatingRecoil)
    const [adheranceRating, setAdheranceRating] = useRecoilState(adheranceRatingRecoil)


    async function onUpload() {
        if (!place || cleanRating === 0 || staffRating === 0 || adheranceRating === 0) return;
        const docRef = doc(db, "reviews", place.name.toUpperCase());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            await updateDoc(doc(db, "reviews", place.name.toUpperCase()), {
                cleanRating: increment(parseInt(cleanRating)),
                adheranceRating: increment(parseInt(adheranceRating)),
                staffRating: increment(parseInt(staffRating)),
                average: ((((docSnap.data().accumRating) / 3) + ((parseInt(cleanRating) + parseInt(adheranceRating) + parseInt(staffRating)) / 3)) / parseInt(docSnap.data().count + 1)),
                accumRating: increment((parseInt(cleanRating) + parseInt(adheranceRating) + parseInt(staffRating))),
                timestamp: serverTimestamp(),
                count: increment(1)
            })
        } else {
            await setDoc(doc(db, "reviews", place.name.toUpperCase()), {
                place: place.name.toUpperCase(),
                cleanRating: parseInt(cleanRating),
                adheranceRating: parseInt(adheranceRating),
                staffRating: parseInt(staffRating),
                accumRating: ((parseInt(cleanRating) + parseInt(adheranceRating) + parseInt(staffRating))),
                timestamp: serverTimestamp(),
                extraData: place,
                count: 1,
                county: county,
                average: ((parseInt(cleanRating) + parseInt(staffRating) + parseInt(adheranceRating)) / 3)
            });
        }
    }

    return (
        <div className="search">
            <Autocomplete
                id='input'
                apiKey={process.env.REACT_APP_GOOGLE_KEY}
                placeholder={"Search Hotels, Restaurants, Landmarks..."}
                onPlaceSelected={async (place) => {
                    try {
                        const proxyurl = "https://young-basin-20621.herokuapp.com/";
                        const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place.place_id}&key=${process.env.REACT_APP_GOOGLE_KEY}`; // site that doesn’t send Access-Control-*
                        setLoadingPlace(true)
                        const response = await fetch(proxyurl + url)
                        const data = await response.json()
                        setPlace(data.result)
                        setLoadingPlace(false)
                        place.address_components.forEach((detailedAddress) => {
                            if (detailedAddress.types.includes("administrative_area_level_1")) setCounty(detailedAddress.long_name)
                            else {
                                if (detailedAddress.types.includes("administrative_area_level_2")) setCounty(detailedAddress.long_name)
                            }
                        })
                    } catch (error) {
                        setLoadingPlace(false)
                    }
                }}
                options={{ types: ["establishment"], }}
            />


            {place && <button onClick={() => {
                onUpload();
                document.getElementById('input').value = '';
                setCleanRating(0); setAdheranceRating(0); setStaffRating(0);
                setPlace(null);
            }}>Upload</button>}
        </div>
    )
}

export default UserInput
