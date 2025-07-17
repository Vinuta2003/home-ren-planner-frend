export default function ProjectCard({ project, onClick, onDelete, onEdit, isSelected }) {
 
  // Format service type for display
  const formatServiceType = (type) => {
    if (!type) return 'Not specified';
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  // Calculate progress percentage (example logic)
  const progressPercentage = project.rooms?.length 
    ? Math.round((project.rooms.filter(r => r.completed).length / project.rooms.length) * 100)
    : 0;

  return (
    <div 
      className={`border p-5 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' : 'border-gray-200'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {formatServiceType(project.serviceType)}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
          )}
        </div>
         <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            aria-label="Edit project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete project"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Estimate</p>
          <p className="font-medium text-gray-800">
            ₹{project.estimatedBudget?.toLocaleString('en-IN') || 'N/A'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Actual Cost</p>
          <p className="font-medium text-gray-400">
            N/A
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500">Timeframe</p>
          <p className="font-medium text-gray-800">
            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} - 
            {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      // {/* Bottom metadata */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
        <div className="flex space-x-3">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {project.rooms?.length || 0} rooms
          </span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {project.rooms?.flatMap(r => r.phases).length || 0} phases
          </span>
        </div>
        {project.ownerName && (
          <span className="text-gray-400">{project.ownerName}</span>
        )}
      </div>
    </div>
  );
}