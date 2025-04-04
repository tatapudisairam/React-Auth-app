import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignUp.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        terms: false
    });
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    const validatePassword = (password) => {
        const minLength = 8;
        const hasLetter = /[A-Za-z]/.test(password);
        const hasNumber = /\d/.test(password);

        if (password.length < minLength) {
            return `Password must be at least ${minLength} characters long.`;
        }
        if (!hasLetter || !hasNumber) {
            return 'Password must contain both letters and numbers.';
        }
        return '';
    };

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phone) {
            return 'Phone number is required.';
        }
        if (!phoneRegex.test(phone)) {
            return 'Phone number must be exactly 10 digits.';
        }
        return '';
    };

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: type === 'checkbox' ? checked : value.trim()
        }));

        if (id === 'password') {
            setPasswordError(validatePassword(value));
        }

        if (id === 'phone') {
            setPhoneError(validatePhoneNumber(value));
        }
    };

    const sanitizeInput = (input) => {
        const temp = document.createElement('div');
        temp.textContent = input;
        return temp.innerHTML;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { name, email, phone, password, confirmPassword, terms } = formData;

        if (!name || !email || !phone || !password || !confirmPassword) {
            toast.error('All fields are required!', { autoClose: 4000 });
            setIsSubmitting(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.', { autoClose: 4000 });
            setIsSubmitting(false);
            return;
        }

        if (!terms) {
            toast.error('You must accept the Terms & Conditions.', { autoClose: 4000 });
            setIsSubmitting(false);
            return;
        }

        if (passwordError || phoneError) {
            toast.error(passwordError || phoneError, { autoClose: 4000 });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('http://82.29.164.13:8001/api/auth/user/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: sanitizeInput(name),
                    email: sanitizeInput(email),
                    phone: sanitizeInput(phone),
                    password: sanitizeInput(password)
                })
            });

            const result = await response.json();
            if (result.status === false) {
                result.errors.forEach((error) => toast.error(error, { autoClose: 4000 }));
            } else {
                toast.success('Signup successful!', { autoClose: 4000 });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                    terms: false
                });
                navigate('/sign-in');
            }
        } catch (error) {
            console.error('Signup Error:', error);
            toast.error('Something went wrong. Please try again later.', { autoClose: 4000 });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className='signup-main-container'>
            <div className="signup-container">
                <p className="signup-container-title">Sign Up</p>
                <form className="signup-input-container" onSubmit={handleSubmit}>
                    <div className="signup-inputs">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="signup-inputs">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="signup-inputs">
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        {phoneError && <p className="error-text">{phoneError}</p>}
                    </div>

                    <div className="signup-inputs">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {passwordError && <p className="error-text">{passwordError}</p>}
                    </div>

                    <div className="signup-inputs">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="signup-checkbox">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={formData.terms}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="terms">I accept the Terms & Conditions</label>
                    </div>

                    <button type="submit" disabled={isSubmitting || !!passwordError || !!phoneError}>
                        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <a href="/sign-in">Already have an account? Login!</a>
            </div>

            <ToastContainer
                position="top-right"
            />
        </div>
    );
};

export default SignUp;
