import React, { useState } from 'react';
import "./Project.scss";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useNavigate } from 'react-router-dom';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import useLongPress from '../../hooks/useLongPress';

import DATA from '../../utilities/dataHandler';

import CircleChart from '../../components/CircleChart';

export default function TaskItem(props) {
    const [holding, setHolding] = useState(false);
    const [holdingTimeout, setHoldingTimeout] = useState(false);

    const navigate = useNavigate();

    const handleLongPress = () => {
        console.log('long press is triggered');
    };

    const handleClick = () => {
        navigate("/task/" + props.project.id + "/" + props.data.id);
    }

    const longPressEvent = useLongPress(handleLongPress, handleClick, {
        shouldPreventDefault: true,
        delay: 500,
    });

    return (
        <div key={props.data.id} className={["project_task_item", holding ? "holding" : null].join(" ")}>
            {props.data.count === 0 ?
                <div className="type" onClick={() => DATA.toggleTask(props.project.id, props.data.id)}>
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
                </div>}
            <div className="name" {...longPressEvent}>
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
