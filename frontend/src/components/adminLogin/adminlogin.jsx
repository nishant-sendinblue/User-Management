import React, { useState } from 'react'
import './adminlogin.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios'
import { API_URL } from '../../config';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';


function Adminlogin() {
    const [showError, setShowError] = useState(false);
    const [errorMsg, seterrorMsg] = useState("");
    const [state, setState] = useState({
        email: "",
        password: ""
    })

    const changeHandler = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            let res = await axios.post(`${API_URL}/login`, state);
            console.log(res);
            if (res?.data?.token) {
                localStorage.setItem("token", res?.data?.token);
                localStorage.setItem("userId", res?.data?.user._id);
                window.location = "/dashboard";
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
        <div className='adminContainer'>
            <form>
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
                <p id='heading'> Admin Login </p>
                <TextField required={true} type="email" className='txtField' onChange={changeHandler} label="Email" name='email' variant="outlined" />
                <TextField required={true} className='txtField' onChange={changeHandler} label="Password" type="password" name='password' variant="outlined" />
                <Button type='submit' onClick={submitHandler} variant="contained">Login</Button>
            </form>
        </div>
    )
}

export default Adminlogin;