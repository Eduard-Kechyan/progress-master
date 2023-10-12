import React, { useEffect, useRef } from 'react';
import "./Modal.scss";

export default function Modal(props) {
    const modalRef = useRef(null);

    useEffect(() => {
        modalRef.current.focus();
    }, [])

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            props.confirm();
        }
    }

    return (
        <div className="modal_wrapper" onKeyDown={handleEnter} tabIndex="0" ref={modalRef}>
            <div className="modal_underlay" onClick={() => props.cancel()} />

            <div className="modal_content">
                <h3 className="modal_name">{props.name}</h3>

                <h3 className="modal_desc">{props.desc}</h3>

                <div className="modal_content_options">
                    {props.isConfirm &&
                        <button className="modal_option cancel" onClick={() => props.cancel()}>
                            Cancel
                        </button>
                    }

                    <button className="modal_option" onClick={() => props.confirm()}>
                        Ok
                    </button>
                </div>
            </div>
        </div>
    );
}