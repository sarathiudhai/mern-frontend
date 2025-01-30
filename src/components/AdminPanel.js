import React, { useState } from 'react';
import axios from 'axios';
import SubjectSelection from './SubjectSelection';
import '../styles/AdminPanel.css';

function AdminPanel() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [message, setMessage] = useState('');

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
        setMessage('');
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSubject) {
            setMessage('Please select a subject first');
            return;
        }
        
        try {
            await axios.post('http://localhost:5000/api/quizzes', {
                question,
                options,
                correctAnswer,
                subject: selectedSubject
            });
            setMessage('Question added successfully!');
            setQuestion('');
            setOptions(['', '', '', '']);
            setCorrectAnswer('');
        } catch (error) {
            setMessage('Error adding question');
        }
    };

    if (!selectedSubject) {
        return <SubjectSelection onSubjectSelect={handleSubjectSelect} />;
    }

    return (
        <div className="admin-container">
            <h2>Add Question - {selectedSubject}</h2>
            <button className="back-button" onClick={() => setSelectedSubject(null)}>
                ← Back to Subjects
            </button>
            <form onSubmit={handleSubmit} className="question-form">
                <div className="form-group">
                    <label>Question:</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />
                </div>
                {options.map((option, index) => (
                    <div key={index} className="form-group">
                        <label>Option {index + 1}:</label>
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required
                        />
                    </div>
                ))}
                <div className="form-group">
                    <label>Correct Answer:</label>
                    <select
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        required
                    >
                        <option value="">Select correct answer</option>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="submit-button">Add Question</button>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
}

export default AdminPanel;
