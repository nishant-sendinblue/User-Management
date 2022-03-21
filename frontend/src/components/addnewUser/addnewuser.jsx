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
import { useNavigate } from 'react-router-dom';

function Addnewuser() {
    const [showError, setShowError] = useState(false);
    const [errorMsg, seterrorMsg] = useState("");
    const [state, setState] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    })

    const changeHandler = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    }
    let navigate = useNavigate();
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            let res = await axios.post(`${API_URL}/create_user`, state);
            if (res.data) {
                navigate("/dashboard")
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
                <TextField required={true} type="text" className='txtField' onChange={changeHandler} label="Name" name='name' variant="outlined" />
                <TextField required={true} type="email" className='txtField' onChange={changeHandler} label="Email" name='email' variant="outlined" />
                <TextField required={true} className='txtField' onChange={changeHandler} label="Password" type="password" name='password' variant="outlined" />
                <TextField select required={true} type="text" className='txtField' onChange={changeHandler} defaultValue="user" label="Role" name='role' variant="outlined" >
                    <MenuItem key="admin" value="admin" >
                        Admin
                    </MenuItem>
                    <MenuItem key="user" value="user">
                        User
                    </MenuItem>
                </TextField>
                <Button type='submit' onClick={submitHandler} variant="contained">Add User</Button>
            </form>
        </div>
    )
}

export default Addnewuser