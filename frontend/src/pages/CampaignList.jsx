// List all campaigns

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
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b border-[#30363d] pb-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">Campaigns</h1>
        {user?.role === 'admin' && (
          <Link
            to="/campaigns/new"
            className="bg-[#1f6feb] text-white px-6 py-2.5 rounded-[6px] text-sm font-bold hover:bg-[#388bfd] border border-[rgba(240,246,252,0.1)] transition-colors shadow-sm"
          >
            Create New Campaign
          </Link>
        )}
      </div>

      <div className="border-b border-[#30363d] pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Status</label>
            <select
              name="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm"
            >
              <option value="">All Statuses</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <p className="text-[#8b949e]">Loading campaigns...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div key={campaign._id} className="bg-[#010409] border border-[#30363d] rounded-[12px] p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white tracking-tight">{campaign.name}</h3>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${campaign.isActive
                      ? 'bg-[#1f6feb]/10 text-[#58a6ff] border-[#1f6feb]/20'
                      : 'bg-[#30363d]/50 text-[#8b949e] border-[#30363d]'
                      }`}
                  >
                    {campaign.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-[#8b949e] mb-6 text-sm h-10 overflow-hidden text-ellipsis">{campaign.description || 'No description'}</p>
                <div className="text-sm text-[#8b949e] space-y-1 mb-6 border-t border-[#30363d] pt-4">
                  <p className="flex justify-between"><span>Start:</span> <span className="text-[#c9d1d9]">{formatDate(campaign.startDate)}</span></p>
                  <p className="flex justify-between"><span>End:</span> <span className="text-[#c9d1d9]">{formatDate(campaign.endDate)}</span></p>
                </div>
                {user?.role === 'admin' && (
                  <div className="flex space-x-4 pt-4 border-t border-[#30363d]">
                    <Link
                      to={`/campaigns/edit/${campaign._id}`}
                      className="text-[#58a6ff] text-sm font-medium hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleToggleActive(campaign)}
                      className="text-[#c9d1d9] text-sm font-medium hover:text-white transition-colors"
                    >
                      {campaign.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDelete(campaign._id)}
                      className="text-[#ff7b72] text-sm font-medium hover:text-[#ff9b8e] transition-colors ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-[#8b949e]">
              No campaigns found
            </div>
          )}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-4 pt-8 border-t border-[#30363d]">
          <button
            onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="text-[#58a6ff] text-sm font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:text-[#8b949e] transition-colors"
          >
            ← Previous
          </button>
          <span className="text-[#c9d1d9] text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.pages}
            className="text-[#58a6ff] text-sm font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:text-[#8b949e] transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignList;


