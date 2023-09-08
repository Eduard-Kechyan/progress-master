import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import Loading from "../../pages/Loading/Loading";

const Router = () => {
    return (
        <Routes>
            { }
            <Route exact path="/" element={<Loading />} />

            {/* Not found */}
            <Route path="*" element={<Navigate to="/" replace />} exact />
        </Routes>
    );
};

export default Router;