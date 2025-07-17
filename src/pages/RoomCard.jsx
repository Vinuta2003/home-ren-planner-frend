import { useState } from 'react'; 
import RoomEditForm from './RoomEditForm';

export default function RoomCard({ room, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  
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
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{room.name}</h3>
              <p className="text-sm text-gray-600 capitalize">
                {room.renovationType?.replace(/_/g, ' ').toLowerCase()}
              </p>
            </div>
            <div className="flex gap-2">
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
          <div className="mt-3">
            <p className="text-sm text-gray-500">Phase details are not shown.</p>
          </div>
        </div>
      )}
    </div>
  );
}