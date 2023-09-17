import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import "./UnderBox.scss";

import Input from '../Form/Input';
import Textarea from '../Form/Textarea';

import DATA from '../../utilities/dataHandler';

export default function EditTaskBox(props) {
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");

    useEffect(() => {
        setNewName(props.name);
        setNewDesc(props.desc);
        // eslint-disable-next-line
    }, [])

    const handleNameChange = (property, value) => {
        setNewName(value);
    }

    const handleDescChange = (property, value) => {
        setNewDesc(value);
    }

    const editTask = (event) => {
        event.preventDefault();

        if (newName !== "") {
            DATA.editTask(props.id, { name: newName, desc: newDesc }).then(() => {
                props.closeUnderBox();
            })
        }
    }

    return (
        <form className="add_edit_project" onSubmit={event => editTask(event)}>
            {/* Title */}
            <Input
                name="name"
                value={newName}
                property="newName"
                handleChange={handleNameChange} />

            {/* Description */}
            <Textarea
                name="Description"
                value={newDesc}
                property="newDesc"
                handleChange={handleDescChange} />

            {/* Edit */}
            <button
                className="add_edit_button"
                style={{ backgroundColor: props.accent }}
                disabled={newName === ""}
                type="submit">
                Edit
                <span className="icon">
                    <EditIcon sx={{ fontSize: 24 }} />
                </span>
            </button>
        </form>
    )
}
