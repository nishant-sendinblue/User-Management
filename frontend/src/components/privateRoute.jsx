import React from 'react'
import { Navigate } from 'react-router-dom';

function PrivateRoute({ component, path }) {
    const token = localStorage.getItem("token");
    if (token) {
        if (path == "/") {
            return <Navigate to="/dashboard" />
        }
        return component;
    }
    else if (path != "/") {
        return <Navigate to="/" />
    }
    else {
        return component;
    }
}

export default PrivateRoute