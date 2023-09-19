import React, { forwardRef } from 'react';
import "./Form.scss";

export default forwardRef(function Input(props, ref) {
    return (
        <label>
            <span className="input_name">{props.name}</span>

            <input
                ref={ref}
                type="text" 
                value={props.value}
                placeholder='...'
                onChange={(event) => props.handleChange(props.property, event.target.value)} />
        </label>
    )
})
