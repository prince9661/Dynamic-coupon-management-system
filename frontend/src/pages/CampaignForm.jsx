// Campaign Form to create/edit campaigns

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
    <div className="max-w-2xl mx-auto pt-8">
      <div className="bg-[#010409] border border-[#30363d] rounded-[12px] p-8 shadow-2xl animate-float">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-8 border-b border-[#30363d] pb-4">
          {isEditMode ? 'Edit Campaign' : 'Create New Campaign'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
              Campaign Name <span className="text-[#ff7b72]">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm placeholder-[#484f58] ${errors.name ? 'border-[#ff7b72] focus:border-[#ff7b72] focus:ring-[#ff7b72]/30' : ''
                }`}
            />
            {errors.name && <p className="text-[#ff7b72] text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-white mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm placeholder-[#484f58] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-white mb-2">
                Start Date <span className="text-[#ff7b72]">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm is-dark-date ${errors.startDate ? 'border-[#ff7b72] focus:border-[#ff7b72] focus:ring-[#ff7b72]/30' : ''
                  }`}
              />
              {errors.startDate && <p className="text-[#ff7b72] text-xs mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold text-white mb-2">
                End Date <span className="text-[#ff7b72]">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm is-dark-date ${errors.endDate ? 'border-[#ff7b72] focus:border-[#ff7b72] focus:ring-[#ff7b72]/30' : ''
                  }`}
              />
              {errors.endDate && <p className="text-[#ff7b72] text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex space-x-4 pt-8 border-t border-[#30363d]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#238636] text-white px-6 py-2.5 rounded-[6px] text-sm font-bold hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Campaign' : 'Create Campaign'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/campaigns')}
              className="text-[#c9d1d9] px-6 py-2.5 text-sm font-medium hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignForm;

