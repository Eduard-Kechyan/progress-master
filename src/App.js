import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTransition, a } from '@react-spring/web';

import DATA from './utilities/dataHandler';

// Layout
import Nav from './components/Layout/Nav';
import UnderBox from './components/UnderBox/UnderBox';

// Pages
import Loading from "./pages/Loading/Loading";
import Dashboard from "./pages/Dashboard/Dashboard";
import Task from "./pages/Task/Task";
import Settings from "./pages/Settings/Settings";

const App = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [underBoxOpen, setUnderBoxOpen] = useState(false);
  const [underBoxName, setUnderBoxName] = useState("");
  const [underBoxContent, setUnderBoxContent] = useState(null);
  const [underBoxTimeout, setUnderBoxTimeout] = useState(false);

  const location = useLocation();

  const transitions = useTransition(location, {
    config: { duration: 100 },
    from: {
      transform: 'translate3d(100%,0,0)'
    },
    enter: {
      transform: 'translate3d(0%,0,0)'
    },
    leave: {
      transform: 'translate3d(-50%,0,0)'
    },
  })

  useEffect(() => {
    let projectsPromise = DATA.getProjects();
    let tasksPromise = DATA.getTasks();
    let currentPromise = DATA.getCurrent();
    let settingsPromise = DATA.getSettings();

    Promise.all([projectsPromise, tasksPromise, currentPromise, settingsPromise]).then(() => {
      DATA.mainLoaded();
    });

    setUnderBoxOpen(false);
  }, [])

  const toggleNav = () => {
    setNavOpen(!navOpen);
  }

  const openUnderBox = (name, content) => {
    setUnderBoxName(name);
    setUnderBoxContent(content);
    setUnderBoxOpen(true);

    clearTimeout(underBoxTimeout);
    setUnderBoxTimeout(null);
  }

  const closeUnderBox = () => {
    setUnderBoxOpen(false);

    setUnderBoxTimeout(setTimeout(() => {
      setUnderBoxName("");
      setUnderBoxContent("");
    }, 200));
  }

  const checkLoadingPage = () => {
    if (location.pathname === process.env.REACT_APP_WEB_URL + "/") {
      return true;
    }

    return false;
  }

  return (
    <>
      {checkLoadingPage() ? null : <>
        <Nav open={navOpen} toggle={toggleNav} />

        <UnderBox
          open={underBoxOpen}
          name={underBoxName}
          content={underBoxContent}
          closeUnderBox={closeUnderBox} />
      </>}

      {transitions((styles, item) => (
        <a.div style={styles} className="layout_wrapper">
          <Routes location={item}>
            {/* Loading */}
            <Route exact path="/" element={<Loading />} />

            {/* Dashboard */}
            <Route exact path="/dashboard" element={
              <Dashboard
                openUnderBox={openUnderBox}
                closeUnderBox={closeUnderBox}
                toggleNav={toggleNav} />} />

            {/* Task */}
            <Route exact path="/task/:projectId" element={
              <Task
                openUnderBox={openUnderBox}
                closeUnderBox={closeUnderBox}
                toggleNav={toggleNav} />} />

            {/* Settings */}
            <Route exact path="/settings" element={
              <Settings
                toggleNav={toggleNav} />} />

            {/* Not found */}
            <Route path="*" element={<Navigate to="/" replace />} exact />
          </Routes>
        </a.div>
      ))}
    </>
  );
};

export default App; 