import PlaceRating from './PlaceRating';
import UserInput from './UserInput';
import Spotlight from './Spotlight';

import { useRecoilValue } from 'recoil';
import { selectedPlace, placeLoading } from '../atoms';

import { CircularProgress } from '@material-ui/core';

const Input = () => {
    const place = useRecoilValue(selectedPlace)
    const loading = useRecoilValue(placeLoading)
    return (
        <section className='Input'>
            <UserInput />
            {loading && <div className="place-spinner"><CircularProgress /></div>}
            {place &&
                <section className="spotlight-info">
                    <Spotlight />
                    <PlaceRating />
                </section>
            }
        </section >

    )
}

export default Input;