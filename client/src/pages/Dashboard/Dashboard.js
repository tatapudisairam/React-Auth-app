import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Dashboard = () => {
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            toast.success('SignIn successful!', { autoClose: 4000 });
        } else {
            navigate('/sign-in');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/sign-in');
    };

    return (
        <div className="dashboard-container">
            <h1>Welcome to the Dashboard!</h1>
            <p>You have successfully signed in.</p>
            {token && <p className="token-display">Your token is: {token}</p>}
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <ToastContainer
                position="top-right"
            />
        </div>

    );
};

export default Dashboard;
