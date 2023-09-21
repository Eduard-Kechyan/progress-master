import React, {  useEffect, useContext, useRef } from 'react';
import { useNavigate, UNSAFE_NavigationContext, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "./Header.scss";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertSharpIcon from '@mui/icons-material/MoreVertSharp';

export default function Header(props) {
  const set = useRef(false);

  const breadcrumbs = useSelector((state) => state.main.breadcrumbs);

  const navigation = useContext(UNSAFE_NavigationContext).navigator;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (set.current) return;

    let reloaded = false;

    if (localStorage.getItem('firstLoad') === null || localStorage.getItem('firstLoad') === "0") {
      localStorage.setItem('firstLoad', 1);
      reloaded = true;
    } else {
      localStorage.setItem('firstLoad', 0);
      reloaded = false;
    }

    if (navigation.action === "POP" && !location.pathname.includes("/dashboard") && !location.pathname.includes("/settings") && !reloaded) {
      goBack();
    }

    set.current = true;
    // eslint-disable-next-line
  }, [location]);

  const goBack = () => {
    if (props.useBreadcrumbs) {
      switch (breadcrumbs.length) {
        case 0:
          navigate(-1);
          break;
        case 1:
          navigate("/dashboard");
          break;
        case 2:
          navigate("/task/" + props.projectId, { state: { projectId: props.projectId, taskId: "", isProject: true } });
          break;
        default:
          let crumbs = breadcrumbs[breadcrumbs.length - 2];

          navigate("/task/" + props.projectId, { state: { projectId: props.projectId, taskId: crumbs.id, isProject: false } });
          break;
      }
    } else {
      navigate(-1);
    }
  }

  return (
    <header>
      {props.goBack ?
        <span className="icon" onClick={() => {
          goBack();

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

      {/* Name */}
      <h4 className={["header_name", props.isDashboard ? "dashboard" : null].join(" ")}>{props.name}</h4>

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