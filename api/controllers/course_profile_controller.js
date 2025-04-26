let profileData = {}; // In-memory storage for profile data

exports.getProfile = async (req, res, next) => {
    const { userId } = req.params;
    try {
        if (userId === '1') { // Assuming userId is 1 for simplicity
            res.json({ userId, ...profileData }); // Return all profile data
        } else {
            res.status(404).json({ error: 'Profile not found' });
        }
    } catch (err) {
        next(err);
    }
};

exports.createDetails = async (req, res, next) => {
    try {
        profileData = req.body; // Save the profile data
        res.status(201).json({ message: 'Profile created successfully', data: profileData });
    } catch (err) {
        next(err);
    }
};

exports.updateDetails = async (req, res, next) => {
    try {
        profileData = { ...profileData, ...req.body }; // Update the profile data
        res.json({ message: 'Profile updated successfully', data: profileData });
    } catch (err) {
        next(err);
    }
};

exports.deleteDetails = async (req, res, next) => {
    try {
        profileData = {}; // Clear the profile data
        res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        next(err);
    }
};
