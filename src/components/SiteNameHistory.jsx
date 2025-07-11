import React from 'react';
import { FaCheck, FaClock } from 'react-icons/fa';

const SiteNameHistory = ({ history, currentName, onSelectName }) => {
  if (history.length === 0) {
    return (
      <div className="history-empty">
        <p>No previous names found</p>
      </div>
    );
  }

  return (
    <div className="name-history">
      <h3>Previous Site Names</h3>
      <ul>
        {history.map((entry, index) => (
          <li 
            key={index} 
            className={entry.name === currentName ? 'current' : ''}
            onClick={() => onSelectName(entry.name)}
          >
            <div className="name-content">
              {entry.name === currentName ? (
                <span className="current-badge"><FaCheck /> Current</span>
              ) : (
                <button className="restore-btn">Restore</button>
              )}
              <span className="name-text">{entry.name}</span>
            </div>
            <div className="history-meta">
              <span className="updated-by">{entry.updatedBy}</span>
              <span className="updated-at">
                <FaClock /> {new Date(entry.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SiteNameHistory;
