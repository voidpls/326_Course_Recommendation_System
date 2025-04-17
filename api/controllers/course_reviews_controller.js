exports.getReviews = async (req, res, next) => {
    const { courseId } = req.params;
    try {
      res.json({ courseId, /* ...whatever data... */ });
    } catch (err) {
      next(err);
    }
};