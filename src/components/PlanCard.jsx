import React from 'react';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';

const PlanCard = ({ plan, onEdit, onDelete }) => {
  const isPopular = plan.isPopular || false;
  const hasDiscount = plan.discount > 0;
  
  return (
    <div className={`plan-card ${isPopular ? 'popular' : ''}`}>
      {isPopular && (
        <div className="popular-badge">
          <FaStar /> Most Popular
        </div>
      )}
      
      <div className="card-header">
        <h3 className="plan-title">{plan.title}</h3>
        <div className="price-container">
          {hasDiscount && (
            <span className="original-price">₹{plan.price}</span>
          )}
          <span className="final-price">
            ₹{hasDiscount ? (plan.price * (1 - plan.discount / 100)).toFixed(2) : plan.price}
          </span>
          <span className="billing-period">/ {plan.days} days</span>
        </div>
        {hasDiscount && (
          <div className="discount-badge">
            Save {plan.discount}%
          </div>
        )}
      </div>
      
      <div className="plan-description">
        {plan.description || 'Premium access to all features'}
      </div>
      
      <ul className="features-list">
        {plan.features?.map((feature, index) => (
          <li key={index} className="feature-item">
            <span className="feature-icon">✓</span>
            {feature}
          </li>
        )) || (
          <>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Access to all content
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Priority support
            </li>
            <li className="feature-item">
              <span className="feature-icon">✓</span>
              Ad-free experience
            </li>
          </>
        )}
      </ul>
      
      <div className="card-footer">
        <button 
          className="edit-btn"
          onClick={() => onEdit(plan)}
        >
          <FaEdit /> Edit
        </button>
        <button 
          className="delete-btn"
          onClick={() => onDelete(plan._id)}
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
