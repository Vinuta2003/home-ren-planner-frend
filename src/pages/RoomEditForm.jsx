import { useState } from 'react';
import { toast } from 'react-toastify';

export default function RoomEditForm({ room, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: room.name,
    renovationType: room.renovationType
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
      const updatedRoom = {
        ...room,
        name: formData.name,
        renovationType: formData.renovationType
      };
      
      onSave(updatedRoom);
     // toast.success('Room updated successfully!');
    } catch (error) {
      toast.error('Failed to update room');
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Room Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Renovation Type
        </label>
        <select
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

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-3 py-1 rounded-md text-white ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}