import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <div className="modal-content">
          {children}
        </div>
        
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="confirm-btn">
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
