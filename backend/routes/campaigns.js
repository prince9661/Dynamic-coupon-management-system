/**
 * ============================================
 * UNIT II - Express: Campaign Routes
 * ============================================
 * 
 * Campaign API:
 * - CRUD operations for campaigns
 * - Demonstrates: GET, POST, PUT, DELETE methods
 * - MongoDB operations (UNIT IV)
 */

import express from 'express';
import Campaign from '../models/Campaign.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateCampaign, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

/**
 * GET /api/campaigns
 * Get all campaigns
 * Demonstrates: GET method, MongoDB query
 */
router.get('/', async (req, res) => {
  try {
    const { isActive, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // MongoDB query (UNIT IV - CRUD: READ)
    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Campaign.countDocuments(query);

    res.json({
      campaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns', message: error.message });
  }
});

/**
 * GET /api/campaigns/:id
 * Get single campaign by ID
 * Demonstrates: GET with parameter, MongoDB findById
 */
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).lean();
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Get campaign statistics
    const stats = await Campaign.findById(req.params.id).then(c => c.getStats());

    res.json({ campaign, stats });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ error: 'Failed to fetch campaign', message: error.message });
  }
});

/**
 * POST /api/campaigns
 * Create new campaign
 * Demonstrates: POST method, MongoDB create, Admin only
 */
router.post('/', requireAdmin, validateCampaign, async (req, res) => {
  try {
    const campaignData = {
      ...req.body,
      createdBy: req.session.username || 'admin'
    };

    // MongoDB create (UNIT IV - CRUD: CREATE)
    const campaign = new Campaign(campaignData);
    await campaign.save();

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Failed to create campaign', message: error.message });
  }
});

/**
 * PUT /api/campaigns/:id
 * Update campaign
 * Demonstrates: PUT method, MongoDB update
 */
router.put('/:id', requireAdmin, validateObjectId, async (req, res) => {
  try {
    // MongoDB update (UNIT IV - CRUD: UPDATE)
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({
      message: 'Campaign updated successfully',
      campaign
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Failed to update campaign', message: error.message });
  }
});

/**
 * DELETE /api/campaigns/:id
 * Delete campaign
 * Demonstrates: DELETE method, MongoDB delete
 */
router.delete('/:id', requireAdmin, validateObjectId, async (req, res) => {
  try {
    // MongoDB delete (UNIT IV - CRUD: DELETE)
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ error: 'Failed to delete campaign', message: error.message });
  }
});

export default router;


