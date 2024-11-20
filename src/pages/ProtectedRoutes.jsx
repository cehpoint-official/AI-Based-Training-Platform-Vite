import React from 'react'
import { Outlet,Navigate } from 'react-router-dom'
const ProtectedRoutes = () => {
    const auth = JSON.parse(sessionStorage.getItem("verified"));
    return (
        auth  ?  <Outlet/> : <Navigate to="/verify"></Navigate>
    )    
}

export default ProtectedRoutes