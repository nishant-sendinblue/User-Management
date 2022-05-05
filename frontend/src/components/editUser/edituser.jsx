import React, { useEffect, useState } from 'react'
import './edituser.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios'
import { API_URL } from '../../config';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import Loader from '../loader';

function Edituser({ token,userData }) {
    let params = useParams();
    const navigate = useNavigate();
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [errorMsg, seterrorMsg] = useState("");
    const [state, setState] = useState({
        name: "",
        email: "",
        status: "",
        role: ""
    })

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoader(true);
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
                    setLoader(false)
                }
            } catch (error) {
                NotificationManager.error(" Some Error Occured!", "Error", 5000)
                throw Error(error);
            }
        }
        fetchUserData();
    }, [params?.id,token])

    const Validate = () => {
        let formValidated = true;
        console.log(state);
        if (state?.name.length < 5) {
            seterrorMsg("Name atleast have 5 letters!")
            setShowError(true);
            formValidated = false;
        }
        else if (!new RegExp(/^[a-zA-Z0-9 ]*$/).test(state?.name)) {
            seterrorMsg("Name should not contain special characters")
            setShowError(true);
            formValidated = false;
        }
        else if (!new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(state?.email)) {
            seterrorMsg("Enter a valid email address!")
            setShowError(true);
            formValidated = false;
        } 
        return formValidated;
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            setShowError(false);
        }
        setShowError(false);
    };

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
                    NotificationManager.success(" User Updated Successfully.", "Success", 5000)
                }
            }
        } catch (error) {
            NotificationManager.error(error.response?.data?.message, "Error", 5000)
            throw Error(error);
        }
    }

    return (
        <div className='editContainer formContainer'>
            <div className='backBtn'>
                <Avatar onClick={()=> navigate(-1) } style={{ marginRight: "5px" }} sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <KeyboardBackspaceRoundedIcon  />
                </Avatar>
            </div>
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
                 {
               loader ?
               <Loader/>
               :
            <>
                <p id='heading'> Edit User </p>
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
                    name='email'
                    variant="outlined" />
                <TextField
                    select
                    required={true}
                    type="text"
                    className='txtField'
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
                {
                    userData?.role === "superAdmin"&&
                    <TextField
                    select
                    required={true}
                    type="text"
                    className='txtField'
                    onChange={changeHandler}
                    value={state?.role}
                    label="Role"
                    name='role'
                    variant="outlined" >
                    <MenuItem key="admin" value="admin" >
                        Admin
                    </MenuItem>
                    <MenuItem key="user" value="user">
                        User
                    </MenuItem>
                </TextField>
                    }
                <Button type='submit' onClick={submitHandler} variant="contained">Update User</Button>
            </>
            }
            </form>
        </div>
    )
}

export default Edituser