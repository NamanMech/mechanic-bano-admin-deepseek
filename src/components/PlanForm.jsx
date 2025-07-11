import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const PlanForm = ({ onSubmit, onCancel, initialData, loading }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    days: '',
    discount: '',
    isPopular: false,
    features: ['', '', '']
  });
  
  const [errors, setErrors] = useState({});

  // Initialize form with initial data if editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        days: initialData.days || '',
        discount: initialData.discount || '',
        isPopular: initialData.isPopular || false,
        features: initialData.features?.length > 0 
          ? [...initialData.features, ''] 
          : ['', '', '']
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle feature changes
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    
    // Add a new empty field if we're at the last feature and it's being filled
    if (index === newFeatures.length - 1 && value.trim() !== '') {
      newFeatures.push('');
    }
    
    // Remove trailing empty features except the last one
    while (newFeatures.length > 1 && newFeatures[newFeatures.length - 1] === '' && newFeatures[newFeatures.length - 2] === '') {
      newFeatures.pop();
    }
    
    setForm({ ...form, features: newFeatures });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.price) newErrors.price = 'Price is required';
    if (isNaN(form.price) || form.price <= 0) newErrors.price = 'Price must be a positive number';
    if (!form.days) newErrors.days = 'Duration is required';
    if (isNaN(form.days) || form.days <= 0) newErrors.days = 'Duration must be a positive number';
    if (form.discount && (isNaN(form.discount) || form.discount < 0 || form.discount > 100)) {
      newErrors.discount = 'Discount must be between 0-100%';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Clean up empty features
      const cleanedFeatures = form.features
        .map(feature => feature.trim())
        .filter(feature => feature !== '');
      
      onSubmit({
        ...form,
        features: cleanedFeatures
      });
    }
  };

  return (
    <div className="plan-form-overlay">
      <div className="plan-form-container">
        <div className="form-header">
          <h2>{initialData ? 'Edit Plan' : 'Create New Plan'}</h2>
          <button className="close-btn" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="plan-form">
          <div className="form-group">
            <label>Plan Title*</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Premium Plan"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the benefits of this plan"
              rows="3"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)*</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <p className="error-message">{errors.price}</p>}
            </div>
            
            <div className="form-group">
              <label>Duration (Days)*</label>
              <input
                type="number"
                name="days"
                value={form.days}
                onChange={handleChange}
                placeholder="e.g. 30"
                className={errors.days ? 'error' : ''}
              />
              {errors.days && <p className="error-message">{errors.days}</p>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Discount (%)</label>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="100"
                className={errors.discount ? 'error' : ''}
              />
              {errors.discount && <p className="error-message">{errors.discount}</p>}
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isPopular"
                  checked={form.isPopular}
                  onChange={handleChange}
                />
                Mark as Popular Plan
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label>Features</label>
            <div className="features-list">
              {form.features.map((feature, index) => (
                <div key={index} className="feature-input">
                  <span className="feature-bullet">•</span>
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : initialData ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
