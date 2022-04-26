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
                                Welcome {userData?.role}, {userData?.name}
                            </Link>
                        </p>
                        <p>
                            <Link to={`/profile/${userData?._id}`}>
                                <Button style={{ "marginRight": "10px" }} variant="outlined" startIcon={<ManageAccountsTwoToneIcon />}>
                                    Profile
                                </Button>
                            </Link>
                            <Button onClick={logoutHandler} variant="outlined" color="info" startIcon={<LogoutTwoToneIcon />}>
                                Logout
                            </Button>
                        </p>
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
