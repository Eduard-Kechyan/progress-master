import React, { useState, useEffect, useRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import "./UnderBox.scss";

import Input from '../Form/Input';

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

export default function AddProjectBox(props) {
    const [newTitle, setNewTitle] = useState("");
    const [newAccent, setNewAccent] = useState("#f7b731");

    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
        // eslint-disable-next-line
    }, [])

    const handleChange = (property, value) => {
        setNewTitle(value);
    }

    const addProject = (event) => {
        event.preventDefault();

        DATA.addProject(newTitle, newAccent).then((id) => {
            DATA.setCurrent({
                id: id,
                title: newTitle,
                accent: newAccent,
                desc: "",
                percent: 0,
                completed: 0,
                total: 0,
            });
            props.closeUnderBox(id);
        }).catch((error) => {
            if (error === "exists") {
                alert("A project with that name already exists!");
            }
        });
    }

    return (
        <form className="add_project" onSubmit={addProject}>
            {/* Title */}
            <Input
                name="Title"
                value={newTitle}
                property="newTitle"
                ref={inputRef}
                handleChange={handleChange} />

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


            {/* Add */}
            <button
                className="add_button"
                style={{ backgroundColor: newAccent }}
                disabled={newTitle === ""}
                type="submit">
                Create
                <span className="icon">
                    <AddIcon sx={{ fontSize: 24 }} />
                </span>
            </button>
        </form>
    )
}
