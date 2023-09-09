import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Header from './Header';
import Nav from './Nav';

import Loading from "../../pages/Loading/Loading";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Settings from "../../pages/Settings/Settings";

const Layout = () => {
  const [pageTitle, setPageTitle] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  const location = useLocation();

  const toggleNav = () => {
    setNavOpen(!navOpen);
  }

  const checkGoBack = () => {
    if (location.pathname.includes("settings")) {
      return true;
    }

    return false;
  }

  const checkLoadingPage = () => {
    if (location.pathname == "/" || location.pathname == "https://progress-master.onrender.com/") {
      return true;
    }

    return false;
  }

  return (
    <>
      {checkLoadingPage() ? null : <>
        <Header goBack={checkGoBack()} pageTitle={pageTitle} navOpen={navOpen} toggleNav={toggleNav} />

        <Nav navOpen={navOpen} toggleNav={toggleNav} />
      </>}

      <div className="layout_container">
        <Routes>
          {/* Loading */}
          <Route exact path="/" element={<Loading />} />

          {/* Dashboard */}
          <Route exact path="/dashboard" element={<Dashboard setPageTitle={setPageTitle} />} />

          {/* Settings */}
          <Route exact path="/settings" element={<Settings setPageTitle={setPageTitle} />} />

          {/* Not found */}
          <Route path="*" element={<Navigate to="/" replace />} exact />
        </Routes>
      </div>
    </>
  );
};

export default Layout;