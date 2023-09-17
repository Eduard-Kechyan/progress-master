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

export default function EditProjectBox(props) {
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newAccent, setNewAccent] = useState("#f7b731");

    useEffect(() => {
        setNewTitle(props.title);
        setNewDesc(props.desc);
        setNewAccent(props.accent);
        // eslint-disable-next-line
    }, [])

    const handleTitleChange = (property, value) => {
        setNewTitle(value);
    }

    const handleDescChange = (property, value) => {
        setNewDesc(value);
    }

    const editProject = (event) => {
        event.preventDefault();

        if (newTitle !== "") {
            DATA.editProject(props.id, { title: newTitle, desc: newDesc, accent: newAccent }).then(() => {
                props.closeUnderBox();
            }).catch((error) => {
                if (error === "exists") {
                    alert("A project with that name already exists!");
                }
            });
        }
    }

    return (
        <form className="add_edit_project" onSubmit={event => editProject(event)}>
            {/* Title */}
            <Input
                name="Title"
                value={newTitle}
                property="newTitle"
                handleChange={handleTitleChange} />

            {/* Description */}
            <Textarea
                name="Description"
                value={newDesc}
                property="newDesc"
                handleChange={handleDescChange} />

            {/* Color */}
            <div className="color_selector">
                <p>Accent Color:</p>
                {colors.map(color =>
                    <span
                        key={color}
                        style={{ backgroundColor: color }}
                        className={["color_item", newAccent === color ? "selected" : null].join(" ")}
                        onClick={() => setNewAccent(color)} />
                )}
            </div>

            { }
            <button
                className="add_edit_button"
                style={{ backgroundColor: newAccent }}
                disabled={newTitle === ""}
                type="submit">
                Edit
                <span className="icon">
                    <EditIcon sx={{ fontSize: 24 }} />
                </span>
            </button>
        </form>
    )
}
