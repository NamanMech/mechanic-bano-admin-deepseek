import React from 'react';

const BrandPreview = ({ siteName }) => {
  return (
    <div className="brand-preview">
      <h2>Brand Preview</h2>
      
      <div className="preview-container">
        <div className="preview-item">
          <h3>Website Header</h3>
          <div className="website-header">
            <div className="logo-placeholder"></div>
            <h1>{siteName || 'Your Site Name'}</h1>
          </div>
        </div>
        
        <div className="preview-item">
          <h3>Browser Tab</h3>
          <div className="browser-tab">
            <div className="tab-bar">
              <div className="tab-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="tab-url">https://yoursite.com</div>
            </div>
            <div className="tab-content">
              <span>{siteName || 'Your Site Name'}</span>
            </div>
          </div>
        </div>
        
        <div className="preview-item">
          <h3>Mobile App</h3>
          <div className="mobile-app">
            <div className="app-header">
              <div className="app-icon"></div>
              <h4>{siteName || 'Your Site Name'}</h4>
            </div>
            <div className="app-content">
              <p>Welcome to our mobile experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPreview;
