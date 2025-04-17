exports.getProgress = async (req, res, next) => {
    const { userId } = req.params;
    try {
      res.json({ userId, /* ...whatever data... */ });
    } catch (err) {
      next(err);
    }
};
    