import React from 'react';
import "./Project.scss";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useNavigate } from 'react-router-dom';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import DATA from '../../utilities/dataHandler';

import CircleChart from '../../components/CircleChart';

export default function TaskItem(props) {
    const navigate = useNavigate();

    return (
        <div key={props.data.id} className="project_task_item">
            {/*props.data.tasks.length === 0 ?
                <div className="type" onClick={() => DATA.toggleTask(props.project.id, props.currentId, props.data.id)}>
                    <span className="icon button" style={{ color: props.project.accent }}>
                        {props.data.completed ?
                            <CheckBoxIcon sx={{ fontSize: 34 }} /> :
                            <CheckBoxOutlineBlankIcon sx={{ fontSize: 34 }} />}
                    </span>
                </div> :
                <div className="type">
                    <span className="icon" style={{ color: props.project.accent }}>
                        <FolderOpenIcon sx={{ fontSize: 34 }} />
                    </span>
                        </div>*/}
            <div className="name" onClick={() => navigate("/task/" + props.project.id + "/" + props.data.id)}>
                <p>{props.data.name}</p>
                <p>{/*props.data.tasks.length*/} sub tasks</p>
            </div>
            <div className="percent">
                <CircleChart accent={props.project.accent} percent={props.data.percent} small size={34} />
            </div>
            <div className="options">
                <span className="icon" onClick={() => props.removeTask(props.data.id, props.data.name)}>
                    <DeleteForeverIcon sx={{ fontSize: 34 }} />
                </span>
            </div>
        </div>
    )
}
