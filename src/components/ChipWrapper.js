import React from 'react'
import Chip from '@material-ui/core/Chip';
import { onRemove, onSelect } from '../slices/chips';
import { useDispatch, useSelector } from 'react-redux';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const ChipWrapper = ({ label }) => {

    const dispatch = useDispatch()
    const state = useSelector(state => state.chip)


    return (
        <div>
            <Chip
                label={label}
                clickable
                onClick={() => { dispatch(onSelect(label)) }}
                style={state.values[label].active ? { fontSize: '16px', backgroundColor: '#35b999' } : { fontSize: '16px', backgroundColor: '#04363d', color: 'white', border: '1px solid white' }}

                onDelete={() => { dispatch(onRemove(label)) }}
                deleteIcon={<HighlightOffIcon />}
                size={'medium'}
            />
        </div>
    )
}

export default ChipWrapper
