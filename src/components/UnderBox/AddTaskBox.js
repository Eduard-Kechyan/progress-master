import React, { useState, useEffect, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import "./UnderBox.scss";

import Input from '../Form/Input';
import Textarea from '../Form/Textarea';

import DATA from '../../utilities/dataHandler';

export default function AddTaskBox(props) {
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");

    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
        // eslint-disable-next-line
    }, [])

    const handleNameChange = (property, value) => {
        setNewName(value);
    }

    const handleDescChange = (property, value) => {
        setNewDesc(value);
    }

    const addTask = (event) => {
        event.preventDefault();

        if (newName !== "") {
            DATA.addTask(props.projectId, props.id, newName, newDesc).then(() => {
                props.closeUnderBox();
            }).catch((error) => {
                if (error === "exists") {
                    alert("A task with that name already exists!");
                }
            });
        }
    }

    return (
        <form className="add_edit_project" onSubmit={(event) => addTask(event)}>
            {/* Name */}
            <Input
                name="Name"
                value={newName}
                property="newName"
                ref={inputRef}
                handleChange={handleNameChange} />

            {/* Desc */}
            {!props.quick && <Textarea
                name="Description"
                value={newDesc}
                property="newDesc"
                handleChange={handleDescChange} />}

            {/* Add */}
            <button
                className="add_edit_button"
                disabled={newName === ""}
                type="submit">
                Add
                <span className="icon">
                    <AddIcon sx={{ fontSize: 24 }} />
                </span>
            </button>
        </form>
    )
}
