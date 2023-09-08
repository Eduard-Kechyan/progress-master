import React, { useState, useEffect } from 'react';
import Router from './Router';

const Layout = () => {
    return (
    < >
      {/* Layout wrapper */}
      <div>
        {/* Layout container */}
        <div className="layout_container">
          <Router />
        </div>
      </div>
    </ >
  );
};

export default Layout;