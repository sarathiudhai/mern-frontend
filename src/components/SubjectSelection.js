import React from 'react';
import '../styles/SubjectSelection.css';

function SubjectSelection({ onSubjectSelect }) {
    const subjects = ['Math', 'Science', 'History'];

    return (
        <div className="subject-container">
            <h2 className="subject-title">Available Quizzes</h2>
            <div className="subject-list">
                {subjects.map((subject) => (
                    <button
                        key={subject}
                        className="subject-button"
                        onClick={() => onSubjectSelect(subject)}
                    >
                        <span className="subject-icon">
                            {subject === 'Math' && '📐'}
                            {subject === 'Science' && '🔬'}
                            {subject === 'History' && '📚'}
                        </span>
                        {subject} Quiz
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SubjectSelection;
