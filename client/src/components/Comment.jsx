import { useState } from "react";

export const Comment = ({
  listingId,
  userId,
  currentUser,
  onCommentSubmit,
  comments,
  handleDeleteComment,
}) => {
  const [content, setContent] = useState("");
  const isUserLogged = Boolean(currentUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isUserLogged) {
      console.log(
        "Usuario no registrado. Debes iniciar sesión o registrarte para comentar."
      );
    }
    try {
      const response = await fetch("/api/comment/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId, userId: currentUser?._id, content }),
      });
      const data = await response.json();
      console.log(data);
      setContent("");
      const newComment = {
        ...data,
        userId: { username: currentUser.username, _id: currentUser._id },
      };
      onCommentSubmit(newComment);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-blue-800">Comment</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="w-full h-20 p-2 border rounded-md"
        />
        <button
          type="submit"
          disabled={!isUserLogged}
          className={`bg-blue-800 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 ${
            !isUserLogged && "cursor-not-allowed"
          }`}
        >
          Add Comment
        </button>
      </form>
      <div className=" flex flex-col mt-8 max-w-screen-lg">
        <h5 className="font-semibold text-blue-800">Comments</h5>
        {comments.map((comment) => (
          <div key={comment._id} className="flex justify-between p-3 border items-center">
            <p className="text-slate-800 max-w-[90%]">
              <span className="font-bold">{comment.userId?.username}: </span>
              {comment.content}
            </p>
            {currentUser?._id === comment.userId?._id && (
              <button
                type="button"
                onClick={() => handleDeleteComment(comment._id)}
                className="p-3 text-red-600 rounded-lg uppercase hover:opacity-75"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
