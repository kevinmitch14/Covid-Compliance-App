import ChipWrapper from '../components/ChipWrapper'

const ChipHeader = () => {
    return (
        <nav className='ChipHeader'>
            <ChipWrapper label="Most Reviewed" />
            <ChipWrapper label="Nearby" />
            <hr></hr>
            <ChipWrapper label="Restaurants" />
            <ChipWrapper label="Cafes" />
            <ChipWrapper label="Bars" />
            <ChipWrapper label="Landmarks" />
            <ChipWrapper label="Hotels" />
            <ChipWrapper label="Retail" />
        </nav>
    )
}

export default ChipHeader
