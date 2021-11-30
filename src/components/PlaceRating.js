import Rating from '@material-ui/lab/Rating';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';


import { cleanRatingRecoil, staffRatingRecoil, adheranceRatingRecoil } from '../atoms';
import { useRecoilState } from 'recoil';

const PlaceRating = () => {

    const [adheranceRating, setAdheranceRating] = useRecoilState(cleanRatingRecoil)
    const [cleanRating, setCleanRating] = useRecoilState(staffRatingRecoil)
    const [staffRating, setStaffRating] = useRecoilState(adheranceRatingRecoil)

    return (
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
    )
}

export default PlaceRating
