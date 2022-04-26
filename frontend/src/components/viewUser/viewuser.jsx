import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../../config';
import "./viewuser.css"
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
function Viewuser({ token }) {
    let params = useParams();
    const [user, setuser] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            let resData = await axios.get(`${API_URL}/users/${params?.id}`, {
                headers: {
                    Authorization: token
                }
            })
            if (resData.data) {
                setuser(resData.data)
            }
        }
        fetchUserData();
    }, [params?.id,token])

    return (
        <>
         <div className='backBtn'>
                <Avatar onClick={()=> navigate(-1) } style={{ marginRight: "5px" }} sx={{ bgcolor: blue[100], color: blue[600] }}>
                    <KeyboardBackspaceRoundedIcon  />
                </Avatar>
            </div>
        <div className='viewContainer'>
           
            <div className='innerViewContainer'>
                <h2>User Details</h2>
                <p><strong>User Id: </strong>{user?._id}</p>
                <p><strong>Name: </strong>{user?.name}</p>
                <p><strong>Email: </strong>{user?.email}</p>
                <p><strong>Status: </strong>{user?.status}</p>
                <p><strong>Role: </strong>{user?.role}</p>
                <p><strong>Created At: </strong>{new Date(user?.createdAt).toDateString() + "," + new Date(user?.createdAt).toLocaleTimeString()}</p>
                <p><strong>Updated At: </strong>{new Date(user?.updatedAt).toDateString() + "," + new Date(user?.updatedAt).toLocaleTimeString()}</p>
            </div>
        </div>
        </>

    )
}

export default Viewuser