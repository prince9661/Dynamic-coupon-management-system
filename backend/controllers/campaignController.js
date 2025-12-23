import Campaign from '../models/Campaign.js';
import Coupon from '../models/Coupon.js';

/**
 * Create a new campaign.
 * 
 * @route POST /api/campaigns
 * @access Private (Admin only)
 */
export const createCampaign = async (req, res) => {
    try {
        const { name, description, startDate, endDate } = req.body;

        const campaign = new Campaign({
            name,
            description,
            startDate,
            endDate,
            createdBy: req.user._id
        });

        const savedCampaign = await campaign.save();
        res.status(201).json(savedCampaign);
    } catch (error) {
        // Check for duplicate key error (code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Campaign name must be unique' });
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get all campaigns with pagination and filters.
 * 
 * @route GET /api/campaigns
 * @access Private
 */
export const getCampaigns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === 'true';
        }

        const campaigns = await Campaign.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Campaign.countDocuments(filter);

        res.json({
            campaigns,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get a single campaign by ID.
 * 
 * @route GET /api/campaigns/:id
 * @access Private
 */
export const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (campaign) {
            res.json(campaign);
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update a campaign.
 * 
 * @route PUT /api/campaigns/:id
 * @access Private (Admin only)
 */
export const updateCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (campaign) {
            // Update fields if they exist in request body
            campaign.name = req.body.name || campaign.name;
            campaign.description = req.body.description || campaign.description;
            campaign.startDate = req.body.startDate || campaign.startDate;
            campaign.endDate = req.body.endDate || campaign.endDate;

            if (req.body.isActive !== undefined) {
                campaign.isActive = req.body.isActive;
            }

            const updatedCampaign = await campaign.save();
            res.json(updatedCampaign);
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete a campaign.
 * Also handles dependency cleanup: Deletes/Inactivates associated coupons.
 * 
 * @route DELETE /api/campaigns/:id
 * @access Private (Admin only)
 */
export const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (campaign) {
            // Delete all coupons associated with this campaign
            // This ensures no orphaned coupons remain
            await Coupon.deleteMany({ campaignId: campaign._id });

            // Use deleteOne() to remove the document
            await campaign.deleteOne();

            res.json({ message: 'Campaign and associated coupons removed' });
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) {
        console.error('Delete Campaign Error:', error);
        res.status(500).json({ message: error.message });
    }
};
