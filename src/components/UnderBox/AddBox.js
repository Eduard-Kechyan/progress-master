import React, { useState, useEffect, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
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

export default function AddBox(props) {
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newAccent, setNewAccent] = useState("#f7b731");

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

    const addProject = (event) => {
        event.preventDefault();

        if (newName !== "") {
            if (props.isProject) {
                DATA.addProject(newName, newAccent).then((id) => {
                    DATA.setCurrent({
                        id: id,
                        name: newName,
                        accent: newAccent,
                        desc: "",
                        percent: 0,
                        completed: 0,
                        total: 0
                    });
                    props.closeUnderBox(id);
                }).catch((error) => {
                    if (error === "exists") {
                        alert("A project with that name already exists!");
                    }
                });
            } else {
                DATA.addTask(props.projectId, props.currentId, newName, newDesc).then(() => {
                    props.closeUnderBox();
                });
            }
        }
    }

    return (
        <form className="add_edit_box" onSubmit={(event) => addProject(event)}>
            {/* Name */}
            <Input
                name="Name"
                value={newName}
                property="newName"
                ref={inputRef}
                handleChange={handleNameChange} />

            {/* Desc */}
            {!props.isProject && !props.quick && <Textarea
                name="Description"
                value={newDesc}
                property="newDesc"
                handleChange={handleDescChange} />}

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

            {/* Add */}
            <button
                className="add_edit_button"
                style={{ backgroundColor: props.isProject ? newAccent : props.accent }}
                disabled={newName === ""}
                type="submit">
                Create
                <span className="icon">
                    <AddIcon sx={{ fontSize: 24 }} />
                </span>
            </button>
        </form>
    )
}
