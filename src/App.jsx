import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Quiz from './components/Quiz';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        // Check for stored user data on component mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setRole(user.role);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setRole(null);
    };

    return (
        <div className="app">
            {!role ? (
                <Login onRoleSelect={(role) => {
                    localStorage.setItem('user', JSON.stringify({ role }));
                    setRole(role);
                }} />
            ) : (
                <>
                    <div className="quiz-header">
                        <h1>Quiz Application</h1>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                    {role === 'student' ? <Quiz /> : <AdminPanel />}
                </>
            )}
        </div>
    );
}

export default App;
