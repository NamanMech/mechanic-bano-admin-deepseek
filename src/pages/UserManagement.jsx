import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner.jsx';
import UserForm from '../components/UserForm.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Pagination from '../components/Pagination.jsx';
import UserTable from '../components/UserTable.jsx';
import UserStats from '../components/UserStats.jsx';
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from '../utils/toastUtils';

export default function UserManagement() {
  // ... existing states ...
  const [originalEmail, setOriginalEmail] = useState(''); // NEW: Track original email for edits

  // Reset current page when filters/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterStartDate, filterEndDate, sortOrder]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}user`);
      setUsers(response.data);
    } catch (error) {
      showErrorToast(`Error fetching users: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email) => {
    // Replace with custom modal in production
    if (window.confirm('Are you sure you want to delete this user?')) {
      setProcessing(true);
      try {
        await axios.delete(`${API_URL}user?email=${encodeURIComponent(email)}`);
        showSuccessToast('User deleted successfully');
        fetchUsers();
      } catch (error) {
        showErrorToast(`Error deleting user: ${error.response?.data?.message || error.message}`);
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      showWarningToast('Name and email are required');
      return;
    }

    setProcessing(true);
    try {
      if (formData._id) {
        // Use original email for identification during updates
        await axios.put(
          `${API_URL}user?email=${encodeURIComponent(originalEmail)}&type=update`,
          formData
        );
        showSuccessToast('User updated successfully');
      } else {
        await axios.post(`${API_URL}user`, formData);
        showSuccessToast('User added successfully');
      }
      fetchUsers();
      setIsFormOpen(false);
      setFormData({ name: '', email: '' });
    } catch (error) {
      showErrorToast(`Error saving user: ${error.response?.data?.message || error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  // Memoized computations for performance
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // ... existing filter logic ...
    });
  }, [users, searchQuery, filterStatus, filterStartDate, filterEndDate]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    });
  }, [filteredUsers, sortOrder]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedUsers.length / pageSize);
  }, [sortedUsers, pageSize]);

  const displayedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  };

  if (loading) return <Spinner />;

  return (
    <div className="container">
      {/* ... existing JSX ... */}
      
      <UserStats users={users} />

      <button
        onClick={() => {
          setIsFormOpen(true);
          setOriginalEmail(''); // Reset original email
          setFormData({ name: '', email: '' });
        }}
        disabled={processing}
        className="btn-primary"
        style={{ marginBottom: '20px' }}
      >
        Add User
      </button>

      {/* ... existing components ... */}

      {isFormOpen && (
        <UserForm
          formData={formData}
          setFormData={setFormData}
          handleFormSubmit={handleFormSubmit}
          isEditing={!!formData._id}
          processing={processing}
          setIsFormOpen={setIsFormOpen}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={handlePageSizeChange} // Updated handler
      />
    </div>
  );
}
