import React from 'react'
import ChipWrapper from '../components/ChipWrapper'

const ChipHeader = () => {
    return (
        <nav className='ChipHeader'>
            <ChipWrapper label="Most Reviewed" id={3} />
            <ChipWrapper label="Nearby" id={6} />
            <hr></hr>
            <ChipWrapper label="Restaurants" id={0} />
            <ChipWrapper label="Bars" id={4} />
            <ChipWrapper label="Landmarks" id={2} />
            <ChipWrapper label="Hotels" id={1} />
            <ChipWrapper label="Retail" id={5} />
        </nav>
    )
}

export default ChipHeader
