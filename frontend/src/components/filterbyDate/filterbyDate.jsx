import React, { useState } from 'react'
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { DateRangePicker } from 'react-date-range';
import Modal from '@mui/material/Modal';
import { addDays } from 'date-fns';
import Button from '@mui/material/Button';
import { NotificationManager } from 'react-notifications';
import Box from '@mui/material/Box';
import axios from 'axios';
import { API_URL } from '../../config';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
function FilterbyDate({ token, setUsers, setPages }) {
    const [openPicker, setOpenPicker] = useState(false)
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
        }
    ]);
    const handleOpenDate = () => {
        setOpenPicker(!openPicker)
    }
    const handleFilterApply = async () => {
        let res = await axios.get(`${API_URL}/users/filter?startDate=${state[0]?.startDate}&endDate=${state[0]?.endDate}`, {
            headers: {
                authorization: token
            }
        })
        if (res?.data?.length > 0) {
            setUsers(res?.data);
            setPages(0);
        } else {
            NotificationManager.info("No User Were Created or Found!", "Info", 5000)
        }
        setOpenPicker(false);
    }
    const handleClose = () => {
        setOpenPicker(false)
    }
    const handleDateChange = (item) => {
        setState([item.selection])
    }
    return (
        <div>
            <Modal
                open={openPicker}
                onClose={handleClose}
            >
                <Box sx={style}>
                    <DateRangePicker
                        onChange={handleDateChange}
                        months={1}
                        ranges={state}
                        showPreview={true}
                    />
                    <span style={{ width: "0", margin: "0 auto", display: "block" }}>
                        <Button onClick={handleFilterApply} variant="contained">
                            Apply
                        </Button>
                    </span>
                </Box>
            </Modal>
            <span>
                <Button onClick={handleOpenDate} variant="outlined" startIcon={<FilterAltIcon />}>
                    Filter users By date
                </Button>
            </span>
        </div>
    )
}

export default FilterbyDate