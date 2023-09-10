import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Header.scss";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';

export default function Header(props) {
  const navigator = useNavigate();

  return (
    <header>
      {props.goBack ?
        <span className="icon" onClick={() => {
          navigator(-1);
          props.openNav && props.toggle();
        }}>
          {/* Go Back */}
          <ArrowBackIcon sx={{ fontSize: 34 }} />
        </span>
        :
        <span className="icon" onClick={() => props.toggle()}>
          {/* Open Nav */}
          <MenuIcon sx={{ fontSize: 34 }} />
        </span>}

      {/* Title */}
      <h4 className={["header_title", props.isDashboard ?"dashboard":null].join(" ")}>{props.title}</h4>

      {/* Loading */}
      {props.loading && !props.isDashboard ?
        <div className="loader small" /> :
        props.hasOptions &&
        <span className="icon" onClick={() => props.optionAction()}>
          <MoreVertSharpIcon sx={{ fontSize: 34 }} />
        </span>}
    </header>
  )
}