import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { listingId, content } = req.body;
    const userId = req.user.id; // Asumiendo que estás utilizando autenticación de usuario

    const comment = await Comment.create({ listingId, userId, content });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const getCommentsByListing = async (req, res, next) => {
  try {
    const listingId = req.params.listingId;

    const comments = await Comment.find({ listingId }).populate(
      "userId",
      "username"
    ); // Popula el usuario para obtener el nombre de usuario

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
      deletedComment,
    });
  } catch (error) {
    next(error);
  }
};
