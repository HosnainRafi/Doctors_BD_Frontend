import { FaEdit, FaRegStar, FaStar, FaTrashAlt } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= rating ? (
        <FaStar key={i} className="text-yellow-400 text-lg" />
      ) : (
        <FaRegStar key={i} className="text-yellow-400 text-lg" />
      )
    );
  }
  return <div className="flex space-x-1">{stars}</div>;
};
const ReviewCard = ({ review, onEdit, onDelete }) => (
  <div className="bg-white shadow-md rounded-lg p-4 mb-5 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-1">
          Dr. {review.doctor_id?.name}
        </h4>
        <p className="text-gray-700 flex-1 text-sm">
          {review.comment || (
            <em className="italic text-gray-400">No comment provided</em>
          )}
        </p>
        <StarRating rating={review.rating} />
      </div>

      <div className="flex gap-3 mt-3 md:mt-0">
        <button
          onClick={() => onEdit(review)}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label="Edit Review"
          title="Edit Review"
        >
          <FaEdit className="text-sm" /> Edit
        </button>
        <button
          onClick={() => onDelete(review._id)}
          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          aria-label="Delete Review"
          title="Delete Review"
        >
          <FaTrashAlt className="text-sm" /> Delete
        </button>
      </div>
    </div>
  </div>
);

export default ReviewCard;
