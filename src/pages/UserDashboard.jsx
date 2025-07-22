import { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance';
import ProjectCard from './ProjectCard';
import CreateProject from './CreateProject';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/projects/user');
        setProjects(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        } else {
          toast.error('Failed to load projects');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [navigate]);

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
    setShowProjectForm(false);
    toast.success('Project created successfully!');
  };

  const handleRoomsUpdate = (projectId, updatedRooms) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.exposedId === projectId ? { ...project, rooms: updatedRooms } : project
      )
    );
  };

  const handleEditProject = (project) => {
    setProjectToEdit(project);
    setShowProjectForm(true);
  };

  const deleteProject = async (exposedId) => {
    try {
      await axiosInstance.delete(`/projects/${exposedId}`);
      setProjects(projects.filter(p => p.exposedId !== exposedId));
      if (selectedProjectId === exposedId) {
        setSelectedProjectId(null);
      }
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading projects...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Renovation Projects</h1>
        <button
          onClick={() => {
            setProjectToEdit(null);
            setShowProjectForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Project
        </button>
      </div>

      {showProjectForm && (
        <CreateProject
          existingProject={projectToEdit}
          onProjectSaved={(updatedProject) => {
            if (projectToEdit) {
              setProjects(projects.map(p =>
                p.exposedId === updatedProject.exposedId ? updatedProject : p
              ));
            } else {
              setProjects([updatedProject, ...projects]);
            }
            setShowProjectForm(false);
            setProjectToEdit(null);
          }}
          onCancel={() => {
            setShowProjectForm(false);
            setProjectToEdit(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 gap-4">
        {projects.map(project => (
          <ProjectCard
            key={project.exposedId}
            project={project}
            onClick={() =>
              setSelectedProjectId(
                selectedProjectId === project.exposedId ? null : project.exposedId
              )
            }
            onDelete={() => deleteProject(project.exposedId)}
            onEdit={() => handleEditProject(project)}
            isSelected={selectedProjectId === project.exposedId}
            onRoomsUpdate={(rooms) => handleRoomsUpdate(project.exposedId, rooms)}
          />
        ))}
      </div>

      {projects.length === 0 && !showProjectForm && (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <p className="text-gray-500 mb-4">You don't have any projects yet</p>
          <button
            onClick={() => {
              setProjectToEdit(null);
              setShowProjectForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Your First Project
          </button>
        </div>
      )}
    </div>
  );
}
