import React from 'react';
import "./UnderBox.scss";

export default function UnderBox(props) {
    return (
        <div className={["under_box", props.open ? "under_box_open" : null].join(" ")}>
            {/* Overlay */}
            <div className="overlay" onClick={() => props.closeUnderBox()} />

            <h4 className="name">{props.name === "" ? "Loading..." : props.name}</h4>

            <div className="content">
                {props.content}
            </div>
        </div>
    )
}
