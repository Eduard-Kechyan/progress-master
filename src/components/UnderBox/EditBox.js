import React, { useState, useEffect } from 'react';
import "./UnderBox.scss";

import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import Input from '../Form/Input';
import Textarea from '../Form/Textarea';

import DATA from '../../utilities/dataHandler';
import ICONS from '../../utilities/icons';

const icons = [...ICONS.normal];

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
    const [newTagIcon, setNewTagIcon] = useState(0);
    const [newTagColor, setNewTagColor] = useState("#f7b731");

    useEffect(() => {
        setNewName(props.name);
        setNewDesc(props.desc);
        setNewAccent(props.accent);

        if (!props.isProject) {
            setNewTagIcon(props.tag.icon);
            setNewTagColor(props.tag.color);
        }

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
                DATA.editProject(props.id, { name: newName, desc: newDesc, accent: newAccent}).then(() => {
                    props.closeUnderBox();
                }).catch((error) => {
                    if (error === "exists") {
                        alert("A project with that name already exists!");
                    }
                });
            } else {
                DATA.editTask(props.id, { name: newName, desc: newDesc, tag: { icon: newTagIcon, color: newTagColor } }).then(() => {
                    props.closeUnderBox();
                })
        }
    }
}

const increaseTagIcon = () => {
    if (newTagIcon === icons.length - 1) {
        setNewTagIcon(0);
    } else {
        setNewTagIcon(newTagIcon + 1);
    }
}

const decreaseTagIcon = () => {
    if (newTagIcon === 0) {
        setNewTagIcon(icons.length - 1);
    } else {
        setNewTagIcon(newTagIcon - 1);
    }
}

const increaseTagColor = () => {
    if (newTagColor === colors[colors.length - 1]) {
        setNewTagColor(colors[0]);
    } else {
        let index = colors.indexOf(newTagColor);

        setNewTagColor(colors[index + 1]);
    }
}

const decreaseTagColor = () => {
    if (newTagColor === colors[0]) {
        setNewTagColor(colors[colors.length - 1]);
    } else {
        let index = colors.indexOf(newTagColor);

        setNewTagColor(colors[index - 1]);
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

        {!props.isProject && !props.quick && <div className="tag_selector">
            <p>Tag: {icons[newTagIcon].name}</p>

            <div className="tag_box">
                <span className="icon" onClick={() => decreaseTagIcon()}>
                    <ArrowBackIcon sx={{ fontSize: 34 }} />
                </span>
                <span className={["icon_alt", newTagIcon === 0 ? "none" : null].join(" ")} style={{ color: newTagColor }}>
                    {icons[newTagIcon].icon}
                </span>
                <span className="icon" onClick={() => increaseTagIcon()}>
                    <ArrowForwardIcon sx={{ fontSize: 34 }} />
                </span>
            </div>

            {newTagIcon > 0 && <div className="tag_box">
                <span className="icon" onClick={() => decreaseTagColor()}>
                    <ArrowBackIcon sx={{ fontSize: 34 }} />
                </span>
                <span className="color_circle" style={{ backgroundColor: newTagColor }} />
                <span className="icon" onClick={() => increaseTagColor()}>
                    <ArrowForwardIcon sx={{ fontSize: 34 }} />
                </span>
            </div>}
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
