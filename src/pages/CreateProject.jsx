import { useState, useEffect } from 'react';
import axiosInstance from '../axios/axiosInstance';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ServiceType = {
  select: 'select',
  WHOLE_HOUSE: 'WHOLE_HOUSE',
  ROOM_WISE: 'ROOM_WISE'
};

export default function CreateProject({ existingProject, onProjectSaved, onCancel }) {
  const navigate = useNavigate();
  const isEdit = !!existingProject;
  
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [currentDate] = useState(() => getCurrentDate());
  const [formData, setFormData] = useState({
    name: existingProject?.name || '',
    estimatedBudget: existingProject?.estimatedBudget || '',
    startDate: existingProject?.startDate?.split('T')[0] || currentDate,
    endDate: existingProject?.endDate?.split('T')[0] || currentDate,
    serviceType: existingProject?.serviceType || ServiceType.select
  });

  useEffect(() => {
    if (!existingProject) {
      setFormData(prev => ({
        ...prev,
        startDate: currentDate,
        endDate: currentDate
      }));
    }
  }, [currentDate, existingProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : null,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        serviceType: formData.serviceType === ServiceType.select ? null : formData.serviceType
      };

      let response;
      if (isEdit) {
        response = await axiosInstance.put(`/projects/${existingProject.exposedId}`, payload);
        toast.success("Project updated successfully");
      } else {
        response = await axiosInstance.post('/projects', payload);
        toast.success("Project created successfully");
      }

      onProjectSaved(response.data);
      onCancel();
      navigate('/userdashboard');
    } catch (error) {
      navigate('/userdashboard');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if ((name === 'startDate' || name === 'endDate') && value < currentDate) {
      toast.warning("Please select a date from today or later");
      return;
    }
    
    if (name === 'endDate' && value < formData.startDate) {
      toast.warning("End date cannot be before start date");
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-700">
              {isEdit ? 'Edit Project' : 'Create New Project'}
            </h2>
            <button 
             
              onClick={() => navigate('/')}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Project Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., Whole Home Renovation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Service Type</label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(ServiceType).map((type) => (
                  <option key={type} value={type}>
                    {type === 'select' ? 'Select Service Type' :
 type === 'WHOLE_HOUSE' ? 'Whole House' :
 type === 'ROOM_WISE' ? 'Room Wise' : type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Estimated Cost ($)</label>
              <input
                type="number"
                name="estimatedBudget"
                value={formData.estimatedBudget}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                placeholder="Enter estimated budget"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                 // value={formData.startDate}
                  onChange={handleChange}
                  min={currentDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-1">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                 // value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || currentDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {isEdit ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
