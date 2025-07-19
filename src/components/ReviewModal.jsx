import { useState } from "react";
import axios from "axios";

function ReviewModal({ vendor, userId, onReviewSubmit }) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    if (!comment || rating === 0) {
      alert("Please provide both rating and comment.");
      return;
    }

    const payload = { vendorId: vendor.id, userId, comment, rating };

    try {
      await axios.post("http://localhost:8080/api/vendor-reviews/reviews", payload);
      alert("Thanks for your review!");
      onReviewSubmit();
    } catch (err) {
      console.error("Review submission failed:", err);
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="fixed bottom-10 right-10 bg-white p-6 rounded shadow-lg border border-gray-200 w-96">
      <h2 className="text-lg font-bold mb-2">Rate {vendor.name}</h2>
      <textarea
        placeholder="Your comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border p-2 mb-2"
      />
      <div className="flex gap-1 mb-2">
        {[1,2,3,4,5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
      >
        Submit Review
      </button>
    </div>
  );
}
// At the bottom of ReviewModal.jsx
export default ReviewModal;
