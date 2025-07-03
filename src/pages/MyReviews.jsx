import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Save, X } from "lucide-react";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ comment: "", rating: 0 });

  const token = localStorage.getItem("accessToken") || localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/vendor-reviews/my-reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      toast.error("Failed to load reviews");
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:8080/api/vendor-reviews/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
    } catch (error) {
      console.error("Error deleting review", error);
      toast.error("Error deleting review");
    }
  };

  const startEdit = (review) => {
    setEditingId(review.reviewId);
    setEditData({ comment: review.comment, rating: review.rating });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ comment: "", rating: 0 });
  };

  const saveEdit = async (reviewId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/vendor-reviews/reviews/${reviewId}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Review updated");
      fetchReviews();
      cancelEdit();
    } catch (error) {
      console.error("Error updating review", error);
      toast.error("Error updating review");
    }
  };

  useEffect(() => {
    if (token) fetchReviews();
    else toast.error("You're not logged in");
  }, []);

  return (
    <div className="mt-24 px-4 md:px-16">
      <h1 className="text-3xl font-bold text-center text-[#002169] mb-6">
        My Vendor Reviews
      </h1>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven't posted any reviews yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.reviewId}
              className="bg-white rounded-xl shadow-md border p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#005eb8]">
                  {review.vendorName}
                </h2>
                <div className="flex gap-2">
                  {editingId === review.reviewId ? (
                    <>
                      <button
                        onClick={() => saveEdit(review.reviewId)}
                        className="text-green-500 hover:text-green-700"
                        title="Save"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-500 hover:text-gray-700"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(review)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit Review"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(review.reviewId)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Review"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {editingId === review.reviewId ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Rating</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={editData.rating}
                      onChange={(e) =>
                        setEditData({ ...editData, rating: e.target.value })
                      }
                      className="w-full border rounded p-1 mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Comment</label>
                    <textarea
                      value={editData.comment}
                      onChange={(e) =>
                        setEditData({ ...editData, comment: e.target.value })
                      }
                      className="w-full border rounded p-2 mt-1"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600">⭐ {review.rating} / 5</p>
                  <p className="text-gray-700">{review.comment}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
