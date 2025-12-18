/**
 * ============================================
 * UNIT IV - Forms: Campaign Creation/Edit Form
 * ============================================
 * 
 * Campaign Form Page:
 * - Create or edit campaign
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCampaign, updateCampaign, fetchCampaignById } from '../store/slices/campaignSlice.js';

const CampaignForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { currentCampaign } = useSelector((state) => state.campaigns);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchCampaignById(id));
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentCampaign) {
      setFormData({
        name: currentCampaign.name || '',
        description: currentCampaign.description || '',
        startDate: currentCampaign.startDate ? new Date(currentCampaign.startDate).toISOString().split('T')[0] : '',
        endDate: currentCampaign.endDate ? new Date(currentCampaign.endDate).toISOString().split('T')[0] : '',
      });
    }
  }, [currentCampaign, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campaign name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        const result = await dispatch(updateCampaign({ id, data: formData }));
        if (updateCampaign.fulfilled.match(result)) {
          navigate('/campaigns');
        }
      } else {
        const result = await dispatch(createCampaign(formData));
        if (createCampaign.fulfilled.match(result)) {
          navigate('/campaigns');
        }
      }

    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-5xl font-bold text-primary-900 tracking-tight mb-16 border-b border-primary-200 pb-4">
        {isEditMode ? 'Edit Campaign' : 'Create New Campaign'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Campaign Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:outline-none text-primary-900 placeholder-primary-400 text-base ${
              errors.name ? 'border-primary-500' : 'border-primary-300 focus:border-primary-900'
            }`}
          />
          {errors.name && <p className="text-primary-600 text-sm mt-2">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 placeholder-primary-400 text-base resize-none"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            Start Date *
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:outline-none text-primary-900 text-base ${
              errors.startDate ? 'border-primary-500' : 'border-primary-300 focus:border-primary-900'
            }`}
          />
          {errors.startDate && <p className="text-primary-600 text-sm mt-2">{errors.startDate}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">
            End Date *
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={`w-full px-0 py-3 border-0 border-b bg-transparent focus:outline-none text-primary-900 text-base ${
              errors.endDate ? 'border-primary-500' : 'border-primary-300 focus:border-primary-900'
            }`}
          />
          {errors.endDate && <p className="text-primary-600 text-sm mt-2">{errors.endDate}</p>}
        </div>

        <div className="flex space-x-4 pt-8 border-t border-primary-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-900 text-white px-8 py-3 text-sm font-medium hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update Campaign' : 'Create Campaign'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/campaigns')}
            className="text-primary-700 px-8 py-3 text-sm font-medium hover:text-primary-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;

