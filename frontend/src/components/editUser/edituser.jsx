import React, { useEffect, useState } from 'react'
import './edituser.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios'
import { API_URL } from '../../config';
import MenuItem from '@mui/material/MenuItem';
import { useParams } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';

function Edituser({ token }) {

    let params = useParams();
    const [state, setState] = useState({
        name: "",
        email: "",
        status: "",
        role: ""
    })

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let resData = await axios.get(`${API_URL}/user_by_id/${params?.id}`, {
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

    const changeHandler = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    }
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            let resData = await axios.patch(`${API_URL}/edit_user/${params.id}`, state, {
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
        } catch (error) {
            NotificationManager.error(" Some Error Occured!", "Error", 5000)
            throw Error(error);

        }
    }

    return (
        <div className='editContainer formContainer'>
            <form >
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
                    disabled={state?.role === "admin"}
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
                <Button type='submit' onClick={submitHandler} variant="contained">Update User</Button>
            </form>
        </div>
    )
}

export default Edituser