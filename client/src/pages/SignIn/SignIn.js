import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignIn.css';

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ emailOrPhone: '', password: '', terms: false });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState('');

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: type === 'checkbox' ? checked : value.trim()
        }));

        if (id === 'emailOrPhone' && value && !/^[\w.-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(value) && !/^\d{10}$/.test(value)) {
            setValidationError('Enter a valid email or 10-digit phone number.');
        } else {
            setValidationError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { emailOrPhone, password, terms } = formData;

        if (!emailOrPhone || !password) {
            toast.error('All fields are required!', { autoClose: 4000 });
            setIsSubmitting(false);
            return;
        }

        if (!terms) {
            toast.error('You must accept the Terms & Conditions.', { autoClose: 4000 });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('http://82.29.164.13:8001/api/auth/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_or_phone: emailOrPhone, password })
            });

            const result = await response.json();
            if (result.status) {
                localStorage.setItem('token', result.token);
                toast.success('SignIn successful!', { autoClose: 4000 });
                navigate('/dashboard');
            } else {
                toast.error(result.message || 'Login failed.', { autoClose: 4000 });
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error('Something went wrong. Please try again later.', { autoClose: 4000 });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='signin-main-container'>
            <div className="signin-container">
                <p className="signin-container-title">Sign In</p>
                <form className="signin-input-container" onSubmit={handleSubmit}>
                    <div className="signin-inputs">
                        <label htmlFor="emailOrPhone">Email or Phone</label>
                        <input
                            type="text"
                            id="emailOrPhone"
                            placeholder="Enter your email or phone"
                            value={formData.emailOrPhone}
                            onChange={handleChange}
                            required
                        />
                        {validationError && <p className="error-text">{validationError}</p>}
                    </div>

                    <div className="signin-inputs">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="signin-checkbox">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="terms">I accept the Terms & Conditions</label>
                    </div>

                    <button type="submit" disabled={isSubmitting || !!validationError}>
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <a href="/sign-up">Don't have an account? Signup!</a>
            </div>

            <ToastContainer
                position="top-right"
            />
        </div>
    );
};

export default SignIn;
