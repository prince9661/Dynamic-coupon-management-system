/**
 * ============================================
 * UNIT V - HTTP & Data Fetching: Campaign List
 * ============================================
 * 
 * Campaign List Page:
 * - Displays all campaigns
 * - Demonstrates: Data fetching, pagination
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCampaigns, deleteCampaign, updateCampaign } from '../store/slices/campaignSlice.js';

const CampaignList = () => {
  const dispatch = useDispatch();
  const { campaigns, pagination, isLoading } = useSelector((state) => state.campaigns);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    isActive: '',
    page: 1,
  });

  useEffect(() => {
    dispatch(fetchCampaigns(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      await dispatch(deleteCampaign(id));
      dispatch(fetchCampaigns(filters));
    }
  };

  const handleToggleActive = async (campaign) => {
    await dispatch(updateCampaign({
      id: campaign._id,
      data: { isActive: !campaign.isActive }
    }));
    // We don't need to refetch if the store updates properly, but for safety with filters:
    dispatch(fetchCampaigns(filters));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-16">
      <div className="flex justify-between items-end border-b border-primary-200 pb-4">
        <h1 className="text-5xl font-bold text-primary-900 tracking-tight">Campaigns</h1>
        {user?.role === 'admin' && (
          <Link
            to="/campaigns/new"
            className="bg-primary-900 text-white px-8 py-3 text-sm font-medium hover:bg-primary-800 transition-colors"
          >
            Create New Campaign
          </Link>
        )}
      </div>

      <div className="border-b border-primary-200 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-3 tracking-tight">Status</label>
            <select
              name="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
              className="w-full px-0 py-3 border-0 border-b border-primary-300 bg-transparent focus:outline-none focus:border-primary-900 text-primary-900 text-base"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <p className="text-primary-600">Loading campaigns...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div key={campaign._id} className="border-b border-primary-200 pb-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-primary-900 tracking-tight">{campaign.name}</h3>
                  <span
                    className={`text-xs font-medium ${campaign.isActive
                      ? 'text-primary-600'
                      : 'text-primary-400'
                      }`}
                  >
                    {campaign.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-primary-600 mb-6 text-sm">{campaign.description || 'No description'}</p>
                <div className="text-sm text-primary-500 space-y-2 mb-6">
                  <p>Start: {formatDate(campaign.startDate)}</p>
                  <p>End: {formatDate(campaign.endDate)}</p>
                </div>
                {user?.role === 'admin' && (
                  <div className="flex space-x-6">
                    <Link
                      to={`/campaigns/edit/${campaign._id}`}
                      className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleActive(campaign)}
                      className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
                    >
                      {campaign.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(campaign._id)}
                      className="text-primary-700 text-sm font-medium hover:text-primary-900 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-primary-500">
              No campaigns found
            </div>
          )}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-6 pt-8 border-t border-primary-200">
          <button
            onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="text-primary-700 text-sm font-medium hover:text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-primary-600 text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
            className="text-primary-700 text-sm font-medium hover:text-primary-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignList;


