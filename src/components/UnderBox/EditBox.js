import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import "./UnderBox.scss";

import Input from '../Form/Input';
import Textarea from '../Form/Textarea';

import DATA from '../../utilities/dataHandler';

const colors = [
    "#f7b731",
    "#fa8231",
    "#eb3b3b",
    '#d054d0',
    "#8854d0",
    "#3867d6",
    "#2d98da",
    "#0fb9b1",
    "#20bf6b"
];

export default function EditBox(props) {
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newAccent, setNewAccent] = useState("#f7b731");

    useEffect(() => {
        setNewName(props.name);
        setNewDesc(props.desc);
        setNewAccent(props.accent);
        // eslint-disable-next-line
    }, [])

    const handleNameChange = (property, value) => {
        setNewName(value);
    }

    const handleDescChange = (property, value) => {
        setNewDesc(value);
    }

    const edit = (event) => {
        event.preventDefault();

        if (newName !== "") {
            if (props.isProject) {
                DATA.editProject(props.id, { name: newName, desc: newDesc, accent: newAccent }).then(() => {
                    props.closeUnderBox();
                }).catch((error) => {
                    if (error === "exists") {
                        alert("A project with that name already exists!");
                    }
                });
            } else {
                DATA.editTask(props.id, { name: newName, desc: newDesc }).then(() => {
                    props.closeUnderBox();
                })
            }
        }
    }

    return (
        <form className="add_edit_box" onSubmit={event => edit(event)}>
            {/* Name */}
            <Input
                name="Name"
                value={newName}
                property="newName"
                handleChange={handleNameChange} />

            {/* Description */}
            <Textarea
                name="Description"
                value={newDesc}
                property="newDesc"
                handleChange={handleDescChange} />

            {/* Color */}
            {props.isProject && <div className="color_selector">
                <p>Accent Color:</p>
                {colors.map(color =>
                    <span
                        key={color}
                        style={{ backgroundColor: color }}
                        className={["color_item", newAccent === color ? "selected" : null].join(" ")}
                        onClick={() => setNewAccent(color)} />
                )}
            </div>}

            {/* Edit */}
            <button
                className="add_edit_button"
                style={{ backgroundColor: props.isProject ? newAccent : props.accent }}
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
