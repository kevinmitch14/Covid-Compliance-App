import React from 'react'
import Chip from '@material-ui/core/Chip';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { activeCategories, userPosition } from '../atoms';

const ChipWrapper = ({ label }) => {
    const [activeCat, setActiveCategories] = useRecoilState(activeCategories)

    const setUserCoords = useSetRecoilState(userPosition)


    return (
        <div>
            <Chip
                label={label}
                clickable
                onClick={() => {
                    if (activeCat.includes(label)) return
                    if (label === "Nearby") {
                        navigator.geolocation.getCurrentPosition((position) => {
                            setUserCoords(position.coords)
                        })
                    }
                    if (label === "Nearby" && activeCat.includes("Most Reviewed")) {
                        let mostReviewedIndex = activeCat.indexOf("Most Reviewed")
                        let newArr = [...activeCat]
                        newArr.splice(mostReviewedIndex, 1)
                        setActiveCategories([...newArr])
                        setActiveCategories([...newArr, label])
                        return
                    }

                    if (label === "Most Reviewed" && activeCat.includes("Nearby")) {
                        let nearbyIndex = activeCat.indexOf("Nearby")
                        let newArr = [...activeCat]
                        newArr.splice(nearbyIndex, 1)
                        setActiveCategories([...newArr])
                        setActiveCategories([...newArr, label])
                        return
                    }
                    else {
                        setActiveCategories((prevState) => [...prevState, label])
                    }
                }}
                style={activeCat.includes(label) ? { fontSize: '16px', backgroundColor: '#35b999' } : { fontSize: '16px', backgroundColor: '#04363d', color: 'white', border: '1px solid white' }}
                onDelete={() => {
                    let restIndex = activeCat.indexOf(label)
                    if (restIndex === -1) return
                    let newState = [...activeCat]
                    newState.splice(restIndex, 1)
                    setActiveCategories(newState)
                }}
                deleteIcon={<HighlightOffIcon />}
                size={'medium'}
            />
        </div>
    )
}

export default ChipWrapper
