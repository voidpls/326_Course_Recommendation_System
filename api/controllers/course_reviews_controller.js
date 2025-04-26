let reviewData = {fake: 'data'}

exports.getReviews = async (req, res, next) => {
  const { courseId } = req.params;  
  try {
      res.json({courseId, reviewData});
    } catch (err) {
      next(err);
    }
};

exports.createReview = async (req, res, next) => {
  try {
      review = req.body; 
      reviewData = {review}
      res.status(201).json({ message: 'Review created successfully', data: review });
  } catch (err) {
      next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  const { reviewId } = req.params; 
  try {
      reviewData = {}; 
      res.json({ message: 'Profile deleted successfully', id: reviewId});
  } catch (err) {
      next(err);
  }
};