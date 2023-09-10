import React from 'react';

import Header from '../../components/Layout/Header';

export default function Settings(props) {
    return (
        <>
            <Header
                goBack
                hasOptions
                openNav
                toggle={props.toggleNav}
                optionAction={()=>{
                    console.log("Options opened!");
                }}
                title="Settings" />

            <div className="layout_container">
                Settings
            </div>
        </>
    )
}
