import { useState } from 'react';
import axiosInstance  from "../axios/axiosInstance";
import { toast } from 'react-toastify';

export default function RoomForm({ projectId, onRoomCreated, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    renovationType: 'FULL_RENOVATION'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

const renovationTypes = [
  { value: 'Select', label: 'Select' },
  { value: 'KITCHEN_RENOVATION', label: 'Kitchen Renovation' },
  { value: 'BATHROOM_RENOVATION', label: 'Bathroom Renovation' },
  { value: 'LIVING_ROOM_REMODEL', label: 'Living Room Remodel' },
  { value: 'BEDROOM_RENOVATION', label: 'Bedroom Renovation' },
  { value: 'BASEMENT_FINISHING', label: 'Basement Finishing' },
  { value: 'ATTIC_CONVERSION', label: 'Attic Conversion' },
  { value: 'FULL_HOME_RENOVATION', label: 'Full Home Renovation' },
  { value: 'EXTERIOR_RENOVATION', label: 'Exterior Renovation' },
  { value: 'GARAGE_RENOVATION', label: 'Garage Renovation' },
  { value: 'BALCONY_RENOVATION', label: 'Balcony Renovation' }
];


const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.name.trim()) {
    toast.error('Room name is required');
    return;
  }

  setIsSubmitting(true);
  
  try {
    const payload = {
      name: formData.name,
      renovationType: formData.renovationType,
     projectExposedId: projectId

    };

    console.log('Current access token:', localStorage.getItem('accessToken'));
    
    const response = await axiosInstance.post('/rooms', payload);
    
    onRoomCreated(response.data);
   // toast.success('Room created successfully!');
    
  } catch (error) {
    console.error('Full error:', error);
    
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      // Optionally redirect to login
      window.location.href = '/login';
    } else {
      const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message || 
                         'Failed to create room';
      toast.error(errorMessage);
    }
  } finally {
    setIsSubmitting(false);
  }
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Room</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Room Name Field */}
        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">
            Room Name *
          </label>
          <input
            type="text"
            id="roomName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Master Bedroom"
            required
          />
        </div>

        {/* Renovation Type Dropdown */}
        <div>
          <label htmlFor="renovationType" className="block text-sm font-medium text-gray-700 mb-1">
            Renovation Type
          </label>
          <select
            id="renovationType"
            name="renovationType"
            value={formData.renovationType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {renovationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : 'Create Room'}
          </button>
        </div>
      </form>
    </div>
  );
}