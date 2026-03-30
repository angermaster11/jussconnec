import { motion } from 'framer-motion';
import { Briefcase, Pencil, Plus } from 'lucide-react';

const ExperienceCard = ({ experience = [], isOwner, onEdit }) => {
  if (experience.length === 0 && !isOwner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-white">Experience</h2>
        {isOwner && (
          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="p-2 hover:bg-navy-700 rounded-lg transition-colors">
              <Plus className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {experience.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Add your work experience to show your career journey.</p>
      ) : (
        <div className="space-y-6">
          {experience.map((exp, i) => (
            <div key={exp._id || i} className="flex gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium">{exp.title}</h3>
                    <p className="text-gray-300 text-sm">{exp.company}{exp.employmentType ? ` · ${exp.employmentType}` : ''}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {exp.startDate && new Date(exp.startDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                      {' – '}
                      {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                    </p>
                    {exp.location && <p className="text-gray-500 text-xs">{exp.location}</p>}
                  </div>
                  {isOwner && (
                    <button className="p-1.5 hover:bg-navy-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                  )}
                </div>
                {exp.description && (
                  <p className="text-gray-400 text-sm mt-2 whitespace-pre-wrap">{exp.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ExperienceCard;
