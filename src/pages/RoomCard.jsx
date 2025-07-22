import { useState } from 'react'; 
import RoomEditForm from './RoomEditForm';
import { useNavigate } from 'react-router-dom';

export default function RoomCard({ room, onDelete, onEdit, onView }) {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  // // Handle card click (excluding buttons)
  // const handleCardClick = () => {
  //   if (onView) onView(room.id);
  // };

  return (
    <div className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow">
      {isEditing ? (
        <RoomEditForm 
          room={room}
          onCancel={() => setIsEditing(false)}
          onSave={(updatedRoom) => {
            onEdit(updatedRoom);
            setIsEditing(false);
          }}
        />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start">
         
            <div 
              className="flex-1 cursor-pointer" 
             
            >
              <h3 className="font-bold text-lg">{room.name}</h3>
              <p className="text-sm text-gray-600 capitalize">
                {room.renovationType?.replace(/_/g, ' ').toLowerCase()}
              </p>
            </div>
            
            {/* Buttons with isolated click */}
            <div 
              className="flex gap-2"
              onClick={(e) => e.stopPropagation()}  // Prevent card click
            >
              <button 
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={onDelete}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
          
          {/* Clickable details section */}
          <div 
            className="mt-3 cursor-pointer flex-1" 
            onClick={() => navigate('/')}  // ✅ Creates a click handler function
          >
            <p className="text-sm text-gray-500">
              View phase details →   
            </p>
          </div>
        </div>
      )}
    </div>
  );
}