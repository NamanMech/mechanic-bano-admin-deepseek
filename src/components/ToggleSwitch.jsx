import React from 'react';

const ToggleSwitch = ({ checked, onChange, disabled }) => {
  return (
    <label className="toggle-switch">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        disabled={disabled}
      />
      <span className="switch-slider"></span>
    </label>
  );
};

export default ToggleSwitch;
