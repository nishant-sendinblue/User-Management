import React, { useEffect, useMemo } from 'react'
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
import Pagination from '@mui/material/Pagination';
import FilterbyDate from '../filterbyDate/filterbyDate';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import debouce from "lodash.debounce";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

function Dashboard({ token }) {

    const [oepnDialog, setOpenDialog] = useState(false)
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [searchByid, setSearchByid] = useState("");
    let listToDisplay = users;
    const [page, setPages] = useState(0);
    const [currentPage, setcurrentPage] = useState(1);
    const indexOfLastPost = currentPage * 6;
    const indexofFirstPost = indexOfLastPost - 6;
    const [userId, setUserId] = useState()
    useEffect(() => {
        getData(currentPage);
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
            let res = await axios.delete(`${API_URL}/users/${userId}`, {
                headers: {
                    authorization: token
                }
            })
            if (res.status === 200) {
                getData(currentPage);
                setOpenDialog(false);
                NotificationManager.success(" User Deleted Successfully.", "Success", 5000)
            }
        }
        catch (error) {
            NotificationManager.error(" Some Error Occured!", "Error", 5000)
            throw Error(error);
        }
    }
    const handleChangePage = (event, value) => {
        setcurrentPage(value);
        getData(value);
    };
    const getData = async (curPage) => {
        try {
            let res = await axios.get(`${API_URL}/users?page=${curPage}&limit=6`, {
                headers: {
                    authorization: token
                }
            })
            if (res.data) {
                setUsers(res.data.results);
                setAllUsers(res.data?.allUsers);
                setPages(Math.ceil(res.data?.allUsers.length / 6));
            }
        }
        catch (error) {
            NotificationManager.error(" Some Error Occured!", "Error", 5000)
            throw Error(error);
        }
    }
    // for searching user
    const [query, setQuery] = useState("");
    const handleSearch = (e) => {
        setQuery(e.target.value);
    }
    if (query !== "") {
        listToDisplay = allUsers.filter((item) => {
            return item?.name.toLowerCase().includes(query.toLowerCase());
        });
    }
    const debouncedResults = useMemo(() => {
        return debouce(handleSearch, 300);
    }, []);

    const handleUserSearchById = async () => {
        try {
            let res = await axios.get(`${API_URL}/users/${searchByid}`, {
                headers: {
                    authorization: token
                }
            })
            if (res?.data) {
                setUsers([res?.data]);
                setPages(0);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSearchByIdChange = (e) => {
        setSearchByid(e.target.value);
        if (e.target.value === "") {
            getData();
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
                    <div className='child1'>
                        <h3 style={{
                            color: "#1976d2", textTransform: "uppercase"
                        }}>Users</h3>
                        <div className='searchById'>
                            <input onChange={handleSearchByIdChange} type="search" placeholder="Search by _id...">
                            </input>
                            <PersonSearchIcon onClick={handleUserSearchById} fontSize="medium" style={{ color: "#1976d2", cursor: "pointer", marginLeft: "-30px" }} />
                        </div>
                    </div>
                    <div className='child2'>
                        {/* for searching user */}
                        <div className='searchContainer'>
                            <div className='inputDiv' >
                                <div className='iconWrapper'>
                                    <SearchIcon
                                    />
                                </div>
                                <InputBase
                                    className='inputBase'
                                    placeholder="Search…"
                                    onChange={debouncedResults}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                        </div>
                        {/* for searching user end */}
                        <FilterbyDate token={token} setUsers={setUsers} setPages={setPages} page={currentPage} />
                        < Link to={"/add_new_user"} >
                            <Button variant="outlined" startIcon={<PersonAddAltTwoToneIcon />}>
                                Add User
                            </Button>
                        </Link>
                    </div>
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
                            listToDisplay.length > 0 ?
                                listToDisplay.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{indexofFirstPost + index + 1}</td>
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
                                :
                                <tr>
                                    <td>No Data to Show!</td>
                                </tr>
                        }


                    </tbody>
                </table>
                {
                    page > 1 &&
                    <div className="pagination">
                        <Pagination count={page} variant="text" page={currentPage} onChange={handleChangePage} color="primary" />
                    </div>
                }
            </div>
        </div >
    )
}

export default Dashboard