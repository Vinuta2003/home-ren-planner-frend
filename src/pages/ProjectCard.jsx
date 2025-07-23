import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import RoomForm from './RoomForm';
import RoomCard from './RoomCard';
import axiosInstance from '../axios/axiosInstance';
import { toast } from 'react-toastify';
import RoomSlider from './RoomSlider';

// Added getBadgeColor function which was missing
// const getBadgeColor = (type) => {
//   switch(type) {
//     case 'Renovation':
//       return 'bg-orange-100 text-orange-800';
//     case 'Construction':
//       return 'bg-blue-100 text-blue-800';
//     case 'Interior Design':
//       return 'bg-purple-100 text-purple-800';
//     case 'Landscaping':
//       return 'bg-green-100 text-green-800';
//     default:
//       return 'bg-gray-100 text-gray-800';
//   }
// };

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
  onRoomsUpdate
}) {
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [rooms, setRooms] = useState(project.rooms || []);
  const navigate = useNavigate(); // Initialize navigate function

  // Format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleRoomCreated = (newRoom) => {
    const updatedRooms = [...rooms, newRoom];
    setRooms(updatedRooms);
    setShowRoomForm(false);
    onRoomsUpdate(project.exposedId, updatedRooms);
  };

  const handleRoomEdit = (updatedRoom) => {
    const updatedRooms = rooms.map(room =>
      room.exposedId === updatedRoom.exposedId ? updatedRoom : room
    );
    setRooms(updatedRooms);
    onRoomsUpdate(project.exposedId, updatedRooms);
  };

  const handleRoomDelete = async (roomExposedId) => {
    try {
      await axiosInstance.delete(`/rooms/${roomExposedId}`);
      const updatedRooms = rooms.filter(room => room.exposedId !== roomExposedId);
      setRooms(updatedRooms);
      onRoomsUpdate(project.exposedId, updatedRooms);
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  // Function to navigate to budget overview
  const goToBudgetOverview = () => {
    // navigate(`/budget-overview/${project.exposedId}`);
    navigate(`/${project.exposedId}/budget-overview`);    

  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-2/3 m-auto my-5 border border-blue-100">
      <div className="flex justify-between items-start">
        <div className="w-full">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-blue-900">{project.name}</h2>
              <p className="text-gray-700 mt-1">{project.description}</p>
            </div>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${(project.renovationType)}`}>
              {project.renovationType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-gray-600">{project.serviceType}</span>
            </div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600">Budget: {project.estimatedBudget}</span>
            </div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 ml-4">
         
          
          <button 
            onClick={onEdit}
            className="p-2 rounded-full hover:bg-blue-100 transition-colors text-blue-600 hover:text-blue-700"
            title="Edit Project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          {/* <button
            onClick={() => setShowRoomForm(!showRoomForm)}
            className="p-2 rounded-full hover:bg-blue-100 transition-colors text-blue-600 hover:text-blue-700"
            title="Add Room"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button> */}
          
          <button
            onClick={onDelete}
            className="p-2 rounded-full hover:bg-red-100 transition-colors text-red-600 hover:text-red-700"
            title="Delete Project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {showRoomForm && (
        <div className="mt-6 border-t border-blue-100 pt-4">
          <RoomForm
            projectId={project.exposedId}
            onRoomCreated={handleRoomCreated}
            onCancel={() => setShowRoomForm(false)}
          />
        </div>
      )}

      {rooms.length > 0 && (
        <div className="mt-6 space-y-4 pt-4 border-t border-blue-100">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-blue-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Rooms
            </h4>
            
            <div className="flex gap-2">
              <button
                onClick={goToBudgetOverview}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Budget Overview</span>
              </button>
              
              <button
                onClick={() => setShowRoomForm(!showRoomForm)}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <span className="text-lg">+</span>
                <span>Add Room</span>
              </button>
            </div>
          </div>
          
          <RoomSlider 
            rooms={rooms} 
            onEdit={handleRoomEdit} 
            onDelete={handleRoomDelete} 
          />
        </div>
      )}

      {/* Empty state for rooms */}
      {rooms.length === 0 && (
        <div className="mt-6 border-t border-blue-100 pt-6 text-center">
          <p className="text-gray-500 mb-4">No rooms added yet</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={goToBudgetOverview}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Budget Overview</span>
            </button>
            
            <button
              onClick={() => setShowRoomForm(true)}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <span className="text-lg">+</span>
              <span>Add First Room</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}