import React from 'react';
import "./CircleChart.scss";

export default function CircleChart(props) {
    return (
        <div
            className={["single_chart", props.small ? "small" : null, props.dark ? "dark" : null].join(" ")}
            style={{ width: props.size + "px", heigh: props.size + "px" }}>
            <svg viewBox={props.small ? "0 0 40 40" : "0 0 36 36"} className="circular_chart" style={{ stroke: props.accent }}>
                <path className="circle_bg"
                    d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle"
                    strokeDasharray={props.percent + ", 100"}
                    d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {props.small ?
                    <text x="18" y="21.5" className="chart_percentage">{props.percent}%</text>
                    :
                    <text x="18" y="20.35" className="chart_percentage">{props.percent}%</text>}
            </svg>
        </div>
    )
}
