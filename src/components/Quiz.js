import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubjectSelection from './SubjectSelection';
import '../styles/Quiz.css';

function Quiz() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState('');

    const handleSubjectSelect = async (subject) => {
        setSelectedSubject(subject);
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/quizzes?subject=${subject}`);
            if (response.data.length === 0) {
                setError(`No questions available for ${subject} yet`);
                setQuestions([]);
            } else {
                setQuestions(response.data);
                setError('');
            }
        } catch (error) {
            setError('Error loading questions');
        }
        setLoading(false);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer('');
    };

    const handleNextQuestion = () => {
        if (!selectedAnswer) {
            alert('Please select an answer before proceeding');
            return;
        }

        if (selectedAnswer === questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        setSelectedAnswer('');
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
        }
    };

    const handleRetry = () => {
        setSelectedSubject(null);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer('');
    };

    if (!selectedSubject) {
        return <SubjectSelection onSubjectSelect={handleSubjectSelect} />;
    }

    if (loading) {
        return <div className="quiz-container">Loading questions...</div>;
    }

    if (error) {
        return (
            <div className="quiz-container">
                <h2>{error}</h2>
                <button className="retry-button" onClick={handleRetry}>
                    Try Another Subject
                </button>
            </div>
        );
    }

    if (showScore) {
        return (
            <div className="quiz-container">
                <div className="score-section">
                    <h2>Quiz Complete!</h2>
                    <p>You scored {score} out of {questions.length}</p>
                    <div className="score-details">
                        <p>Percentage: {((score / questions.length) * 100).toFixed(1)}%</p>
                        <p>Status: {score >= questions.length * 0.6 ? 'Passed! 🎉' : 'Try again to improve'}</p>
                    </div>
                    <button className="retry-button" onClick={handleRetry}>
                        Try Another Subject
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <h2>{selectedSubject} Quiz</h2>
            <button className="back-button" onClick={handleRetry}>
                ← Back to Subjects
            </button>
            {questions.length > 0 && (
                <div className="question-section">
                    <div className="question-count">
                        Question {currentQuestion + 1}/{questions.length}
                    </div>
                    <div className="question-text">
                        {questions[currentQuestion].question}
                    </div>
                    <div className="answer-section">
                        {questions[currentQuestion].options.map((option, index) => (
                            <label key={index} className="radio-label">
                                <input
                                    type="radio"
                                    name="quiz-option"
                                    value={option}
                                    checked={selectedAnswer === option}
                                    onChange={(e) => setSelectedAnswer(e.target.value)}
                                />
                                <span className="radio-text">{option}</span>
                            </label>
                        ))}
                    </div>
                    <button 
                        className="next-button" 
                        onClick={handleNextQuestion}
                    >
                        {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default Quiz;
