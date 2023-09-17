import React from 'react';
import "./UnderBox.scss";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';

export default function ProjectBox(props) {
    return (
        <div className="project">
             <button className="option_button edit" onClick={() => props.edit()}>
                <span className="icon"><EditIcon sx={{ fontSize: 28 }} /></span>
                Edit
            </button>
            <button className="option_button remove" onClick={() => props.remove()}>
                <span className="icon"><DeleteForeverIcon sx={{ fontSize: 28 }} /></span>
                Remove
            </button>
        </div>
    )
}
