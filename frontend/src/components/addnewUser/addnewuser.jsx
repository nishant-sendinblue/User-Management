import React, { useState } from 'react'
import "./addnewuser.css"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios'
import { API_URL } from '../../config';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { NotificationManager } from 'react-notifications';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { useNavigate } from 'react-router-dom';


function Addnewuser({userData}) {
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const [errorMsg, seterrorMsg] = useState("");
    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const Validate = () => {
        let formValidated = true;
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
        } else if (state?.password?.length < 6) {
            seterrorMsg("Password should contains atleast 6 charaters")
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
                let res = await axios.post(`${API_URL}/create_user`, state);
                if (res.data) {
                    setState({
                        name: "",
                        email: "",
                        password: "",
                        role: "user"
                    });
                    NotificationManager.success("User Added Successfully", "Success", 5000);
                }
            }
        } catch (error) {
            seterrorMsg(error?.response?.data?.message);
            setShowError(true);
        }
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            setShowError(false);
        }
        setShowError(false);
    };
    return (
        <div className='formContainer'>
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
                <p id='heading'> Add New User </p>
                <TextField value={state?.name} required={true} type="text" className='txtField' onChange={changeHandler} label="Name" name='name' variant="outlined" />
                <TextField value={state?.email} required={true} type="email" className='txtField' onChange={changeHandler} label="Email" name='email' variant="outlined" />
                <TextField value={state?.password} required={true} className='txtField' onChange={changeHandler} label="Password" type="password" name='password' variant="outlined" />
                {
                userData?.role !== "admin" &&
                    <TextField select required={true} type="text" className='txtField' onChange={changeHandler} defaultValue="user" label="Role" name='role' variant="outlined" >
                        <MenuItem key="admin" value="admin" >
                            Admin
                        </MenuItem>
                        <MenuItem key="user" value="user">
                            User
                        </MenuItem>
                    </TextField>
                }
                <Button type='submit' onClick={submitHandler} variant="contained">Add User</Button>
            </form>
        </div>
    )
}

export default Addnewuser