import React from "react";
import "./navbar.css";
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import Button from '@mui/material/Button';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import { Link } from "react-router-dom";

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
                        <p id="name">
                            <Avatar style={{ marginRight: "5px" }} sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <PersonOutlineTwoToneIcon />
                            </Avatar>
                            <Link to="/dashboard">
                                Welcome, {userData?.name}
                            </Link>
                        </p>
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
