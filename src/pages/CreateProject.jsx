import { useState } from 'react';
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

  const [formData, setFormData] = useState({
    name: existingProject?.name || '',
    estimatedBudget: existingProject?.estimatedBudget || '',
    startDate: existingProject?.startDate?.split('T')[0] || '', // Format date for input
    endDate: existingProject?.endDate?.split('T')[0] || '',     // Format date for input
    serviceType: existingProject?.serviceType || ServiceType.select
  });

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
      onCancel(); // Close the form
          navigate('/userdashboard');
    } catch (error) {
          navigate('/userdashboard');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">
            {isEdit ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., Whole Home Renovation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              {Object.values(ServiceType).map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost ($)</label>
              <input
                type="number"
                name="estimatedBudget"
                value={formData.estimatedBudget}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
                placeholder="50000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

         
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEdit ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
