import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function ReviewModal({ vendor, onReviewSubmit }) {
  console.log("🚀 ReviewModal mounted", vendor);

  const [review, setReview] = useState({ comment: "", rating: 0 });
  const [userId, setUserId] = useState(null);

  const tokenFromRedux = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
     console.log("💡 useEffect running");
    let token = tokenFromRedux;
    console.log(token);

    // Fallback: get from localStorage
    if (!token) {
      const storedToken = localStorage.getItem("accessToken");
      token = storedToken || null;
    }

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded); // ✅ Correct usage here
        const extractedUserId =decoded.id;
        if (extractedUserId) {
          setUserId(extractedUserId);
        } else {
          alert("User ID missing in token!");
        }
      } catch (err) {
        console.error("Invalid token format:", err);
        alert("Failed to decode user token");
      }
    } else {
      alert("User not logged in!");
    }
  }, [tokenFromRedux]);

  const submitReview = async () => {
    if (!review.comment || review.rating === 0) {
      alert("Please add comment and rating");
      return;
    }

    const payload = {
      vendorId: vendor.exposedId,
      userId,
      comment: review.comment,
      rating: review.rating,
    };

    try {
      console.log("Submitting review payload:", payload);

      await axios.post("http://localhost:8080/api/vendor-reviews/reviews", payload);
      alert("Review submitted successfully!");
      setReview({ comment: "", rating: 0 });
      onReviewSubmit(); // callback to parent
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  return (
    <div className="mt-10 border-t pt-6 text-left">
      <h2 className="text-xl font-semibold text-blue-800 mb-3">
        Leave a Review for {vendor.name}
      </h2>

      <textarea
        value={review.comment}
        onChange={(e) =>
          setReview((prev) => ({ ...prev, comment: e.target.value }))
        }
        placeholder="Write your comment"
        className="w-full p-3 border border-gray-300 rounded mb-3"
      />

      <div className="flex items-center gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() =>
              setReview((prev) => ({ ...prev, rating: star }))
            }
            className={`text-2xl ${
              star <= review.rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
        <span>
          {review.rating > 0
            ? `${review.rating} Star${review.rating > 1 ? "s" : ""}`
            : "No rating"}
        </span>
      </div>

      <button
        onClick={submitReview}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        Submit Review
      </button>
    </div>
  );
}
