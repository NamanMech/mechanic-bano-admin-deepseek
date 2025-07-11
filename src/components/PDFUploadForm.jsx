import React, { useState } from 'react';
import { showSuccessToast, showErrorToast } from '../utils/toastUtils';
import LoadingSpinner from './LoadingSpinner';

const PDFUploadForm = ({ onUploadSuccess, editingPdf, apiUrl, currentUser }) => {
  const [title, setTitle] = useState(editingPdf?.title || '');
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState(editingPdf?.category || 'free');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Upload logic here
      onUploadSuccess();
    } catch (error) {
      showErrorToast(error.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form-container">
      <h3 className="form-title">
        {editingPdf ? 'Update PDF' : 'Upload New PDF'}
      </h3>
      
      <form onSubmit={handleSubmit} className="pdf-upload-form">
        <div className="form-group">
          <label htmlFor="pdf-title">PDF Title*</label>
          <input
            id="pdf-title"
            type="text"
            placeholder="Enter PDF title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="pdf-file">
            {editingPdf ? 'Replace PDF File' : 'Select PDF File*'}
          </label>
          <div className="file-input-container">
            <input
              id="pdf-file"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required={!editingPdf}
            />
            <label htmlFor="pdf-file" className="file-input-label">
              {fileName || 'Choose file...'}
            </label>
            {fileName && (
              <span className="file-size">
                ({Math.round(file.size / 1024)} KB)
              </span>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="pdf-category">Category*</label>
          <select 
            id="pdf-category"
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="free">Free</option>
            <option value="premium">Premium (Subscribers Only)</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="submit-btn"
        >
          {loading ? <LoadingSpinner small /> : editingPdf ? 'Update PDF' : 'Upload PDF'}
        </button>
      </form>
    </div>
  );
};

export default PDFUploadForm;
