import { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import RoomCard from './RoomCard';
import RoomForm from './RoomForm';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function HomeButton() {
  const navigate = useNavigate();

  function handleClick() {
    navigate('/budget-overview'); 
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Go Budget Overview
    </button>
  );
}


export default function RoomList({ projectId, rooms: initialRooms, onRoomsUpdate }) {
  const [rooms, setRooms] = useState(initialRooms);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

 
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/rooms/project/${projectId}`);
       const roomsWithPhases = response.data;
        setRooms(roomsWithPhases);
        onRoomsUpdate(roomsWithPhases);
      } catch (error) {
        toast.error('Failed to load rooms');
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialRooms || initialRooms.length === 0) {
      fetchRooms();
    }
  }, [projectId]);

  const handleRoomCreated = (newRoom) => {
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    onRoomsUpdate(updatedRooms);
    setShowForm(false);
    toast.success('Room created successfully!');
  };

const handleDeleteRoom = async (roomExposedId) => {
  try {
    await axiosInstance.delete(`/rooms/${roomExposedId}`);
    const updatedRooms = rooms.filter(room => room.exposedId !== roomExposedId);
    setRooms(updatedRooms);
    onRoomsUpdate(updatedRooms);
    toast.success('Room deleted successfully');
  } catch (error) {
    toast.error('Failed to delete room');
  }
};
const handleEditRoom = async (updatedRoom) => {
  try {
    const response = await axiosInstance.put(
      `/rooms/${updatedRoom.exposedId}`,
      {
        name: updatedRoom.name,
        renovationType: updatedRoom.renovationType
      }
    );
    
    const updatedRooms = rooms.map(room => 
      room.exposedId === updatedRoom.exposedId ? response.data : room
    );
    
    setRooms(updatedRooms);
    onRoomsUpdate(updatedRooms);
    toast.success('Room updated successfully');
  } catch (error) {
    toast.error('Failed to update room');
  }
};

  if (isLoading) return <div className="text-center py-4">Loading rooms...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Rooms</h2>
        <div className="flex gap-2"> 
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Room
        </button>
           <HomeButton />
         </div>
      </div>

      {showForm && (
        <RoomForm 
          projectId={projectId} 
          onRoomCreated={handleRoomCreated} 
          onCancel={() => setShowForm(false)}
        />
      )}

      {rooms.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No rooms yet. Add your first room!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map(room => (
            <RoomCard 
              key={room.exposedId} 
              room={room}
              onDelete={() => handleDeleteRoom(room.exposedId)} // ✅ correct
              onEdit={handleEditRoom}
            />
          ))}
        </div>
      )}
    </div>
  );
}

