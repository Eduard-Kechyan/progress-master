import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import DATA from './utilities/dataHandler';

import Nav from './components/Layout/Nav';
import UnderBox from './components/UnderBox/UnderBox';

import Loading from "./pages/Loading/Loading";
import Dashboard from "./pages/Dashboard/Dashboard";
import Project from "./pages/Projects/Project";
import Settings from "./pages/Settings/Settings";

const App = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [underBoxOpen, setUnderBoxOpen] = useState(false);
  const [underBoxTitle, setUnderBoxTitle] = useState("");
  const [underBoxContent, setUnderBoxContent] = useState(null);
  const [underBoxTimeout, setUnderBoxTimeout] = useState(false);

  const location = useLocation();

  useEffect(() => {
    DATA.getProjects();
    DATA.getCurrent();
  }, [])

  const toggleNav = () => {
    setNavOpen(!navOpen);
  }

  const openUnderBox = (title, content) => {
    setUnderBoxTitle(title);
    setUnderBoxContent(content);
    setUnderBoxOpen(true);

    clearTimeout(underBoxTimeout);
    setUnderBoxTimeout(null);
  }

  const closeUnderBox = () => {
    setUnderBoxOpen(false);

    setUnderBoxTimeout(setTimeout(() => {
      setUnderBoxTitle("");
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
          title={underBoxTitle}
          content={underBoxContent}
          closeUnderBox={closeUnderBox} />
      </>}

      <Routes>
        {/* Loading */}
        <Route exact path="/" element={<Loading />} />

        {/* Dashboard */}
        <Route exact path="/dashboard" element={
          <Dashboard
            openUnderBox={openUnderBox}
            closeUnderBox={closeUnderBox}
            toggleNav={toggleNav} />} />

        {/* Project */}
        <Route exact path="/project/:id" element={
          <Project
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
    </>
  );
};

export default App; 