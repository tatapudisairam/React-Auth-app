import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/sign-up');
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Homepage!</h1>
            <button onClick={handleRedirect}>Go to Sign-Up</button>
        </div>
    );
};

export default Homepage;
