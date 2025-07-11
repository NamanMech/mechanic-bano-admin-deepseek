import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessToast, showErrorToast, showWarningToast } from '../utils/toastUtils';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import PlanCard from '../components/PlanCard';
import PlanForm from '../components/PlanForm';
import ConfirmationModal from '../components/ConfirmationModal';
import { FaCrown, FaPlus, FaSearch, FaSync } from 'react-icons/fa';

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch subscription plans
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}subscription`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setPlans(response.data);
      setFilteredPlans(response.data);
    } catch (err) {
      showErrorToast('Failed to load subscription plans');
      console.error('Subscription plans error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    setSaving(true);
    
    try {
      if (editingPlan) {
        // Update existing plan
        await axios.put(`${API_URL}subscription?id=${editingPlan._id}`, formData, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        showSuccessToast('Plan updated successfully!');
      } else {
        // Create new plan
        await axios.post(`${API_URL}subscription`, formData, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        showSuccessToast('Plan created successfully!');
      }
      
      // Reset form and fetch updated plans
      setShowForm(false);
      setEditingPlan(null);
      fetchPlans();
    } catch (err) {
      showErrorToast('Error saving plan');
      console.error('Save plan error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Handle plan deletion
  const handleDelete = async () => {
    if (!deletePlanId) return;
    
    setSaving(true);
    try {
      await axios.delete(`${API_URL}subscription?id=${deletePlanId}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      showSuccessToast('Plan deleted successfully!');
      fetchPlans();
    } catch (err) {
      showErrorToast('Failed to delete plan');
      console.error('Delete plan error:', err);
    } finally {
      setSaving(false);
      setDeletePlanId(null);
    }
  };

  // Filter plans based on search query
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = plans.filter(plan => 
        plan.title.toLowerCase().includes(query) ||
        plan.description?.toLowerCase().includes(query) ||
        plan.price.toString().includes(query)
      );
      setFilteredPlans(filtered);
    } else {
      setFilteredPlans(plans);
    }
  }, [searchQuery, plans]);

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div className="subscription-plans-container">
      <div className="plans-header">
        <div className="header-content">
          <h1>
            <FaCrown className="icon" /> Subscription Plans
          </h1>
          <p className="subtitle">
            Create and manage subscription plans for your users
          </p>
        </div>
        
        <div className="header-actions">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            className="refresh-btn"
            onClick={fetchPlans}
            disabled={loading}
          >
            <FaSync /> Refresh
          </button>
          
          <button 
            className="add-plan-btn"
            onClick={() => {
              setShowForm(true);
              setEditingPlan(null);
            }}
          >
            <FaPlus /> Add New Plan
          </button>
        </div>
      </div>

      {/* Add/Edit Plan Form */}
      {showForm && (
        <PlanForm 
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPlan(null);
          }}
          initialData={editingPlan}
          loading={saving}
        />
      )}

      {/* Plans List */}
      <div className="plans-content">
        {loading ? (
          <div className="loading-container">
            <LoadingSpinner />
            <p>Loading subscription plans...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="no-plans">
            <div className="no-plans-content">
              <h3>No subscription plans found</h3>
              <p>{searchQuery ? 'Try adjusting your search' : 'Create your first subscription plan'}</p>
              <button 
                className="create-plan-btn"
                onClick={() => setShowForm(true)}
              >
                <FaPlus /> Create Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="plans-grid">
            {filteredPlans.map(plan => (
              <PlanCard 
                key={plan._id}
                plan={plan}
                onEdit={() => {
                  setEditingPlan(plan);
                  setShowForm(true);
                }}
                onDelete={setDeletePlanId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deletePlanId}
        onClose={() => setDeletePlanId(null)}
        onConfirm={handleDelete}
        title="Delete Subscription Plan"
      >
        <p>Are you sure you want to delete this subscription plan?</p>
        <p className="warning">This action cannot be undone and will affect all users subscribed to this plan.</p>
      </ConfirmationModal>
    </div>
  );
}
