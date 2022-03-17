import React, { useEffect } from 'react'
import './dashboard.css'
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Link } from 'react-router-dom';
import FiberManualRecordTwoToneIcon from '@mui/icons-material/FiberManualRecordTwoTone';
import axios from 'axios';
import { API_URL } from '../../config';
import { useState } from 'react';
import Button from '@mui/material/Button';
import PersonAddAltTwoToneIcon from '@mui/icons-material/PersonAddAltTwoTone';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { NotificationManager } from 'react-notifications';

function Dashboard({ token, userData }) {

    const [oepnDialog, setOpenDialog] = useState(false)
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState()
    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                let res = await axios.get(`${API_URL}/get_all_users`, {
                    headers: {
                        Authorization: token
                    }
                })
                if (res.data) {
                    setUsers(res.data);
                }
            } catch (error) {
                NotificationManager.error(" Some Error Occured!", "Error", 5000)
                throw Error(error);
            }
        }
        fetchAllUsers();
    }, [])

    const handleDeleteUser = (id) => {
        setOpenDialog(true);
        setUserId(id);
    }
    const handleClose = () => {
        setOpenDialog(false);
    };
    const handleDisagree = () => {
        setOpenDialog(false);
    }
    const handleAgree = async () => {
        try {
            let res = await axios.delete(`${API_URL}/delete_user/${userId}`, {
                headers: {
                    authorization: token
                }
            })
            if (res.data) {
                setUsers(res.data);
                setOpenDialog(false);
                NotificationManager.success(" User Deleted Successfully.", "Success", 5000)
            }
        }
        catch (error) {
            NotificationManager.error(" Some Error Occured!", "Error", 5000)
            throw Error(error);
        }
    }

    return (
        <div className='dashContainer'>
            <Dialog
                open={oepnDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        On agree, user will be deleted permanently!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDisagree}>Disagree</Button>
                    <Button onClick={handleAgree} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            <div className='innerDashContent'>
                <div className='aboveTable'>
                    <h3 style={{ color: "#1976d2" }}>Users</h3>
                    <Link to={"/add_new_user"}>
                        <Button variant="outlined" startIcon={<PersonAddAltTwoToneIcon />}>
                            Add User
                        </Button>
                    </Link>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.length > 0 &&
                            users.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    {item.status === "active" ?
                                        <td id='active'><FiberManualRecordTwoToneIcon color='success' fontSize="10" />Active </td>
                                        :
                                        <td id='active'><FiberManualRecordTwoToneIcon color='error' fontSize="10" />InActive </td>
                                    }
                                    <td id='role'>{item.role}</td>
                                    <td>
                                        <Link to={`/view_user/${item._id}`} >
                                            <VisibilityTwoToneIcon color='primary' />
                                        </Link>
                                        {
                                            item.role === "user" &&
                                            <>
                                                <Link to={`/edit_user/${item._id}`}>
                                                    <ModeEditTwoToneIcon color='success' />
                                                </Link>
                                                <span onClick={() => handleDeleteUser(item._id)}>
                                                    <DeleteTwoToneIcon color='error' />
                                                </span>
                                            </>
                                        }
                                    </td>
                                </tr>
                            ))
                        }


                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard