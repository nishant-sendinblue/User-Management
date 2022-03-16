import React from "react";
import "./navbar.css";
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import Button from '@mui/material/Button';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';

function Navbar({ userData }) {
    const logoutHandler = () => {
        localStorage.removeItem("token");
        window.location = "/"
    }

    return (
        <>
            {
                userData?.email ?
                    <div className="navbar">
                        <p id="name"><PersonOutlineTwoToneIcon />Welcome, {userData?.name}</p>
                        <Button onClick={logoutHandler} variant="outlined" color="info" startIcon={<LogoutTwoToneIcon />}>
                            Logout
                        </Button>
                    </div>
                    :
                    <div className="navbar">
                        <p id="name2"><ManageAccountsTwoToneIcon /> User Management System</p>
                    </div>
            }
        </>
    );
}

export default Navbar;
