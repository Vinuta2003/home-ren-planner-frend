import { useNavigate } from "react-router-dom";

function ProjectPage() {
  const navigate = useNavigate();

  // Dummy list of projects
  const projects = [
    { id: "123e4567-e89b-12d3-a456-426614174000", name: "Project A" },
    { id: "123e4567-e89b-12d3-a456-426614174000", name: "Project B" },
  ];

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Projects</h1>

      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white p-4 rounded shadow mb-4 hover:bg-blue-100 cursor-pointer"
          onClick={() => navigate(`/phase/project/${project.id}`)}
        >
          {project.name}
        </div>
      ))}
    </div>
  );
}

export default ProjectPage;
