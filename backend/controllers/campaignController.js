
import Campaign from '../models/Campaign.js';

/**
 * Get all campaigns
 */
export const getCampaigns = async (req, res) => {
    try {
        const { isActive, page = 1, limit = 10 } = req.query;
        const query = {};

        if (isActive !== undefined && isActive !== '') {
            query.isActive = isActive === 'true';
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

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
};

/**
 * Get single campaign by ID
 */
export const getCampaignById = async (req, res) => {
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
};

/**
 * Create new campaign
 */
export const createCampaign = async (req, res) => {
    try {
        const campaignData = {
            ...req.body,
            createdBy: req.session.username || 'admin'
        };

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
};

/**
 * Update campaign
 */
export const updateCampaign = async (req, res) => {
    try {
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
};

/**
 * Delete campaign
 */
export const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);

        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        console.error('Delete campaign error:', error);
        res.status(500).json({ error: 'Failed to delete campaign', message: error.message });
    }
};
