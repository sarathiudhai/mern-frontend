import React, { useState } from 'react';
import '../styles/Login.css';
import axios from 'axios';

function Login({ onRoleSelect }) {
    const [studentCredentials, setStudentCredentials] = useState({ username: '', password: '' });
    const [adminCredentials, setAdminCredentials] = useState({ username: 'admin', password: 'admin123' });
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleStudentLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                ...studentCredentials,
                role: 'student'
            });
            
            if (response.data.user.role === 'student') {
                setError('');
                setMessage(response.data.message);
                // Store user data in localStorage for persistence
                localStorage.setItem('user', JSON.stringify(response.data.user));
                onRoleSelect('student');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error logging in');
            setMessage('');
        }
    };

    const handleStudentRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/register', studentCredentials);
            setMessage(response.data.message);
            // After successful registration, automatically log in
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                onRoleSelect('student');
            }
            setIsRegistering(false);
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Error registering');
            setMessage('');
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                ...adminCredentials,
                role: 'admin'
            });
            
            if (response.data.user.role === 'admin') {
                setError('');
                setMessage(response.data.message);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                onRoleSelect('admin');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error logging in');
            setMessage('');
        }
    };

    return (
        <div className="login-container">
            <h1 className="quiz-title">QUIZ TIME</h1>
            <div className="login-forms-container">
                <div className="login-form student-form">
                    <h2>STUDENT</h2>
                    <form onSubmit={isRegistering ? handleStudentRegister : handleStudentLogin}>
                        <div className="form-group">
                            <label>USERNAME</label>
                            <input
                                type="text"
                                value={studentCredentials.username}
                                onChange={(e) => setStudentCredentials({
                                    ...studentCredentials,
                                    username: e.target.value
                                })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>PASSWORD</label>
                            <input
                                type="password"
                                value={studentCredentials.password}
                                onChange={(e) => setStudentCredentials({
                                    ...studentCredentials,
                                    password: e.target.value
                                })}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">
                            {isRegistering ? 'REGISTER' : 'LOGIN'}
                        </button>
                        <button
                            type="button"
                            className="switch-button"
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                                setMessage('');
                                setStudentCredentials({ username: '', password: '' });
                            }}
                        >
                            {isRegistering ? 'Back to Login' : 'New Student? Register'}
                        </button>
                    </form>
                </div>

                <div className="login-form admin-form">
                    <h2>ADMIN</h2>
                    <form onSubmit={handleAdminLogin}>
                        <div className="form-group">
                            <label>USERNAME</label>
                            <input
                                type="text"
                                value={adminCredentials.username}
                                onChange={(e) => setAdminCredentials({
                                    ...adminCredentials,
                                    username: e.target.value
                                })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>PASSWORD</label>
                            <input
                                type="password"
                                value={adminCredentials.password}
                                onChange={(e) => setAdminCredentials({
                                    ...adminCredentials,
                                    password: e.target.value
                                })}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">LOGIN</button>
                    </form>
                </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}
        </div>
    );
}

export default Login;
