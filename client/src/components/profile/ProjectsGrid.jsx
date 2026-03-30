import { motion } from 'framer-motion';
import { ExternalLink, Github, Plus } from 'lucide-react';

const ProjectsGrid = ({ projects = [], isOwner, onEdit }) => {
  if (projects.length === 0 && !isOwner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-white">Projects</h2>
        {isOwner && (
          <button onClick={onEdit} className="p-2 hover:bg-navy-700 rounded-lg transition-colors">
            <Plus className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Showcase your projects and portfolio work.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={project._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-navy-800/50 rounded-xl p-4 border border-navy-700/50 hover:border-primary/30 transition-colors group"
            >
              {project.image && (
                <img src={project.image} alt={project.title} className="w-full h-32 object-cover rounded-lg mb-3" />
              )}
              <h3 className="text-white font-medium group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{project.description}</p>
              )}
              <div className="flex items-center gap-3 mt-3">
                {project.url && (
                  <a href={project.url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <ExternalLink className="h-3.5 w-3.5" /> Live
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-white hover:underline">
                    <Github className="h-3.5 w-3.5" /> Source
                  </a>
                )}
              </div>
              {project.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.technologies.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-navy-700 text-gray-400 text-xs rounded-md">{t}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProjectsGrid;
