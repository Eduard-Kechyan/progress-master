import React from 'react'

export default function Textarea(props) {
    return (
        <label>
            <span className="name">{props.name}</span>

            <textarea
                type="text"
                value={props.value}
                placeholder='...'
                onChange={(event) => props.handleChange(props.property, event.target.value)} />
        </label>
  )
}
