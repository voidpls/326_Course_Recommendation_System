exports.getDetails = async (req, res, next) => {
    const { courseId } = req.params;
    try {
      // e.g. const details = await CourseDetails.findById(courseId);
      res.json({ courseId, /* ...whatever data... */ });
    } catch (err) {
      next(err);
    }
};

