import React, { useEffect, useState } from 'react'
import './profile.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios'
import { API_URL } from '../../config';
import MenuItem from '@mui/material/MenuItem';
import { useParams } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';

function Profile({ token }) {
    let params = useParams();
    const [showError, setShowError] = useState(false);
    const [errorMsg, seterrorMsg] = useState("");
    const [state, setState] = useState({
        name: "",
        email: "",
        status: "",
        role: ""
    })
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            setShowError(false);
        }
        setShowError(false);
    };
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let resData = await axios.get(`${API_URL}/users/${params?.id}`, {
                    headers: {
                        Authorization: token
                    }
                })
                if (resData.data) {
                    setState({
                        name: resData?.data?.name,
                        email: resData?.data?.email,
                        status: resData?.data?.status,
                        role: resData?.data?.role,
                    })
                }
            } catch (error) {
                NotificationManager.error(" Some Error Occured!", "Error", 5000)
                throw Error(error);
            }
        }
        fetchUserData();
    }, [])

    const Validate = () => {
        let formValidated = true;
        if (state?.name?.length < 5) {
            seterrorMsg("Name atleast have 5 letters!")
            setShowError(true);
            formValidated = false;
        }
        else if (!new RegExp(/^[a-zA-Z0-9 ]*$/).test(state?.name)) {
            seterrorMsg("Name should not contain special characters")
            setShowError(true);
            formValidated = false;
        }
        return formValidated;
    }

    const changeHandler = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    }
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            let isValidated = Validate();
            if (isValidated) {
                let resData = await axios.patch(`${API_URL}/users/${params.id}`, state, {
                    headers: {
                        authorization: token
                    }
                });
                if (resData?.data) {
                    setState({
                        name: resData?.data?.name,
                        email: resData?.data?.email,
                        status: resData?.data?.status,
                        role: resData?.data?.role,
                    })
                    NotificationManager.success(" Profile Updated Successfully.", "Success", 5000)
                }
            }
        } catch (error) {
            NotificationManager.error(" Some Error Occured!", "Error", 5000)
            throw Error(error);

        }
    }

    return (
        <div className='editContainer formContainer'>
            <form >
                {showError &&
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        open={showError}
                        onClose={handleClose}
                        autoHideDuration={3000}
                        TransitionComponent={Slide}
                    >
                        <MuiAlert onClose={handleClose} variant="filled" severity="error">
                            {errorMsg}
                        </MuiAlert>
                    </Snackbar >
                }
                <p id='heading'> Admin Profile </p>
                <TextField
                    required={true}
                    type="text"
                    className='txtField'
                    value={state?.name}
                    onChange={changeHandler}
                    label="Name"
                    name='name'
                    variant="outlined"
                />
                <TextField
                    required={true}
                    type="email"
                    className='txtField'
                    value={state?.email}
                    onChange={changeHandler}
                    label="Email"
                    disabled={true}
                    name='email'
                    variant="outlined" />
                <TextField
                    select
                    required={true}
                    type="text"
                    className='txtField'
                    disabled={true}
                    onChange={changeHandler}
                    value={state?.status}
                    label="Status"
                    name='status'
                    variant="outlined" >
                    <MenuItem key="active" value="active" >
                        Active
                    </MenuItem>
                    <MenuItem key="inactive" value="inactive">
                        InActive
                    </MenuItem>
                </TextField>
                <TextField
                    select
                    required={true}
                    type="text"
                    className='txtField'
                    onChange={changeHandler}
                    value={state?.role}
                    disabled={true}
                    label="Role"
                    name='role'
                    variant="outlined" >
                    <MenuItem key="superAdmin" value="superAdmin" >
                        SuperAdmin
                    </MenuItem>
                    <MenuItem key="admin" value="admin" >
                        Admin
                    </MenuItem>
                    <MenuItem key="user" value="user">
                        User
                    </MenuItem>
                </TextField>
                <Button type='submit' onClick={submitHandler} variant="contained">Save</Button>
            </form>
        </div>
    )
}

export default Profile