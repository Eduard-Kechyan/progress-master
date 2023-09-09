import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TuneIcon from '@mui/icons-material/Tune';

export default function Header(props) {
  const navigator = useNavigate();

  return (
    <header>
      {props.goBack ?
        <>
          {/* Go Back */}
          <span className="icon" onClick={() => navigator(-1)}>
            <ArrowBackIcon sx={{ fontSize: 34 }} />
          </span>

          {/* Title */}
          <h4 className="header_title">{props.pageTitle}</h4>
        </>
        :
        <>
          {/* Open Nav */}
          <span className="icon" onClick={() => props.toggleNav()}>
            <MenuIcon sx={{ fontSize: 34 }} />
          </span>

          {/* Title */}
          <h4 className="header_title">{props.pageTitle}</h4>

          {/* Settings */}
          <span className="icon" onClick={() => navigator("/settings")}>
            <TuneIcon sx={{ fontSize: 34 }} />
          </span>
        </>}
    </header>
  )
}