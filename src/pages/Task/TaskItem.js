import React, { useRef } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';
import "./Task.scss";
import tinycolor from "tinycolor2";

import DATA from '../../utilities/dataHandler';
import ICONS from '../../utilities/icons';

import CircleChart from '../../components/CircleChart';

export default function TaskItem(props) {
    const optionsRef = useRef(null);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/task/" + props.project.id, { state: { projectId: props.project.id, taskId: props.data.id, isProject: false } });
    }

    return (
        <Draggable draggableId={props.data.id} index={props.index}>
            {(provided, snapshot) => {
                let transform = provided.draggableProps.style.transform;

                if (snapshot.isDragging && transform) {
                    // eslint-disable-next-line
                    transform = transform.replace(/\(.+\,/, "(0,");
                }

                const newStyles = {
                    ...provided.draggableProps.style,
                    transform,
                    backgroundColor: tinycolor(props.project.accent).lighten(5).toString()
                };

                return (
                    <div
                        className={[
                            "task_item",
                            snapshot.isDragging ? "isDragging" : null,
                            props.data.isCompleted ? "isCompleted" : "isNotCompleted",
                            tinycolor(props.project.accent).getLuminance() < 0.35 ? "isLight" : null
                        ].join(" ")}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        style={newStyles}
                        onClick={(event) => {
                            if (event.target.id === "options_button") {
                                optionsRef.current.focus();
                            }
                        }}
                    >
                        {props.data.children.length === 0 ?
                            <div className="type" onClick={() => DATA.toggleTask(props.project.id, props.data.id)}>
                                <span className="icon button" >
                                    {props.data.isCompleted ?
                                        <CheckBoxIcon sx={{ fontSize: 34 }} /> :
                                        <CheckBoxOutlineBlankIcon sx={{ fontSize: 34 }} />}
                                </span>
                            </div> :
                            <div className="type">
                                <span className="icon" style={{ color: props.project.accent }}>
                                    <FolderSpecialIcon sx={{ fontSize: 34 }} />
                                </span>
                            </div>}
                        <div className="name" onClick={() => handleClick()}>
                            <p>{props.data.name}</p>
                            <p>
                                {props.data.children.length} sub tasks
                                {props.data.tag.icon > 0 &&
                                    <span
                                        className={["icon", props.data.desc !== "" ? "has_desc" : null].join(" ")}
                                        style={{ color: props.project.accent === props.data.tag.color ? "" : props.data.tag.color }}>
                                        {ICONS.small[props.data.tag.icon].icon}
                                    </span>}
                                {props.data.desc !== "" && <span className="icon"><DescriptionIcon sx={{ fontSize: 20 }} /></span>}
                            </p>
                        </div>
                        <div className="percent">
                            <CircleChart accent={props.project.accent} percent={props.data.percent} small size={34} />
                        </div>
                        <div className="options" tabIndex="0" ref={optionsRef}>
                            <div id="options_button" className="icon button">
                                <MoreVertSharpIcon sx={{ fontSize: 34 }} />
                            </div>
                            <div className="drop_down">
                                <div className="icon_alt" onClick={() => props.editTask(props.data)}>
                                    <EditIcon sx={{ fontSize: 28 }} />
                                </div>
                                <div className="icon_alt" onClick={() => props.removeTask(props.data.id, props.data.name)}>
                                    <DeleteForeverIcon sx={{ fontSize: 28 }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }}
        </Draggable>
    )
}
