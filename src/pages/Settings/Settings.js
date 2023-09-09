import React, { useEffect } from 'react';

export default function Settings(props) {
    useEffect(() => {
        props.setPageTitle("Settings");
    }, [])


    return (
        <div>Settings</div>
    )
}
