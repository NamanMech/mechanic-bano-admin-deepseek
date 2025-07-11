import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { showSuccessToast, showErrorToast, showWarningToast } from '../utils/toastUtils';
import { supabase } from '../utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import PDFViewer from '../components/PDFViewer';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import PDFUploadForm from '../components/PDFUploadForm';

export default function PDFManagement() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  
  const API_URL = import.meta.env.VITE_API_URL;
  const PDFS_PER_PAGE = 5;

  // Fetch PDFs with pagination and search
  const fetchPdfs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        type: 'pdf',
        page: currentPage,
        limit: PDFS_PER_PAGE,
        search: searchQuery
      };
      
      const response = await axios.get(`${API_URL}general`, { params });
      setPdfs(response.data.pdfs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      showErrorToast('Error fetching PDFs');
      console.error('Fetch PDFs error:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL, currentPage, searchQuery]);

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs]);

  // Handle file upload to Supabase
  const uploadToSupabase = async (file) => {
    if (!file) throw new Error('No file provided');
    
    // Validate file type and size
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size exceeds 10MB limit');
    }
    
    const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `pdfs/${fileName}`;

    const { error } = await supabase.storage.from('pdfs').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
    
    if (error) throw new Error(`Upload failed: ${error.message}`);
    
    const { data } = supabase.storage.from('pdfs').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // Handle PDF deletion
  const handleDelete = async () => {
    if (!deletingId) return;
    
    try {
      setLoading(true);
      await axios.delete(`${API_URL}general?type=pdf&id=${deletingId}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      showSuccessToast('PDF deleted successfully');
      fetchPdfs();
    } catch (err) {
      showErrorToast('Failed to delete PDF');
      console.error('Delete PDF error:', err);
    } finally {
      setLoading(false);
      setDeletingId(null);
      setIsDeleteModalOpen(false);
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (id) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingId(null);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="pdf-management-container">
      <h1 className="page-title">PDF Management</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search PDFs by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button 
          onClick={() => setSearchQuery('')}
          className="clear-search-btn"
        >
          Clear
        </button>
      </div>
      
      <PDFUploadForm 
        onUploadSuccess={fetchPdfs} 
        editingPdf={null}
        apiUrl={API_URL}
        currentUser={currentUser}
      />
      
      <h2 className="section-title">Uploaded PDFs</h2>
      
      {loading ? (
        <LoadingSpinner />
      ) : pdfs.length === 0 ? (
        <div className="no-pdfs-message">
          <p>No PDFs found</p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="clear-filter-btn"
            >
              Clear search filter
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="pdf-grid">
            {pdfs.map((pdf) => (
              <PDFItem 
                key={pdf._id}
                pdf={pdf}
                onEdit={() => console.log('Edit functionality')}
                onDelete={confirmDelete}
                currentUser={currentUser}
              />
            ))}
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <span>Page {currentPage} of {totalPages}</span>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete this PDF? This action cannot be undone.</p>
        <p className="warning-text">The PDF file will be permanently removed from storage.</p>
      </ConfirmationModal>
    </div>
  );
}

// PDF Item Component
const PDFItem = ({ pdf, onEdit, onDelete, currentUser }) => (
  <div className="pdf-card">
    <div className="pdf-header">
      <h3 className="pdf-title">{pdf.title}</h3>
      <span className={`pdf-category ${pdf.category}`}>
        {pdf.category === 'premium' ? '🔒 Premium' : '🆓 Free'}
      </span>
    </div>
    
    <div className="pdf-preview-container">
      {pdf.originalLink ? (
        <PDFViewer url={pdf.originalLink} />
      ) : (
        <div className="no-preview">
          <p>No preview available</p>
        </div>
      )}
    </div>
    
    <div className="pdf-meta">
      <p className="upload-date">
        Uploaded: {new Date(pdf.createdAt).toLocaleDateString()}
      </p>
      <div className="pdf-actions">
        {currentUser.role === 'admin' && (
          <>
            <button 
              onClick={() => onEdit(pdf)} 
              className="edit-btn"
              aria-label="Edit PDF"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(pdf._id)} 
              className="delete-btn"
              aria-label="Delete PDF"
            >
              Delete
            </button>
          </>
        )}
        <a 
          href={pdf.originalLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="download-btn"
        >
          Download
        </a>
      </div>
    </div>
  </div>
);
