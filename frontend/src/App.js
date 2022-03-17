import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
import Adminlogin from './components/adminLogin/adminlogin';
import Dashboard from './components/dashboard/dashboard';
import PrivateRoute from './components/privateRoute';
import Navbar from './components/navbar/navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from './config';
import Addnewuser from './components/addnewUser/addnewuser';
function App() {
  const [userData, setuserData] = useState()
  let token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      //fetching LoggedIn user data
      const fetchData = async () => {
        let res = await axios.get(`${API_URL}/get_user`, {
          headers: {
            "Authorization": token
          }
        })
        if (res?.data?.email) {
          setuserData(res.data);
        }
      }
      fetchData();
    }

  }, [])


  return (
    <Router>
      <NotificationContainer />
      <Navbar userData={userData} />
      <Routes>
        <Route exact path='/' element={<PrivateRoute path="/" component={<Adminlogin />} />} />
        <Route exact path="/dashboard" element={<PrivateRoute path="/dashboard" component={<Dashboard token={token} userData={userData} />} />} />
        <Route exact path="/add_new_user" element={<PrivateRoute path="/add_new_user" component={<Addnewuser token={token} userData={userData} />} />} />
      </Routes>
    </Router>
  );
}

export default App;
