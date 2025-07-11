.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.toast-icon {
  font-size: 1.5rem;
}

.toast-message {
  font-size: 0.95rem;
  line-height: 1.4;
}

/* PDF Management */
.pdf-management-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.search-container {
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.clear-search-btn, .clear-filter-btn {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background 0.3s;
}

.clear-filter-btn {
  background: #3498db;
  margin-top: 10px;
}

.clear-search-btn:hover, .clear-filter-btn:hover {
  opacity: 0.9;
}

.section-title {
  margin: 30px 0 20px;
  color: #34495e;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.pdf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.pdf-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.pdf-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.pdf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.pdf-title {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.pdf-category {
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.pdf-category.free {
  background: #e8f5e9;
  color: #2e7d32;
}

.pdf-category.premium {
  background: #fff3e0;
  color: #ef6c00;
}

.pdf-preview-container {
  height: 250px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-preview {
  color: #7f8c8d;
  text-align: center;
  padding: 20px;
}

.pdf-meta {
  padding: 15px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.upload-date {
  margin: 0 0 10px;
  color: #7f8c8d;
  font-size: 14px;
}

.pdf-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn, .download-btn {
  flex: 1;
  padding: 8px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  transition: background 0.3s;
}

.edit-btn {
  background: #3498db;
  color: white;
}

.delete-btn {
  background: #e74c3c;
  color: white;
}

.download-btn {
  background: #2ecc71;
  color: white;
  text-decoration: none;
}

/* Pagination */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination-controls button {
  padding: 8px 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

/* Confirmation Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirmation-modal {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
}

.modal-content {
  padding: 20px;
}

.warning-text {
  color: #e74c3c;
  font-weight: bold;
  margin-top: 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

.cancel-btn, .confirm-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn {
  background: #95a5a6;
  color: white;
}

.confirm-btn {
  background: #e74c3c;
  color: white;
}
