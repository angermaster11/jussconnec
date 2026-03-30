import { motion } from 'framer-motion';
import { GraduationCap, Pencil, Plus } from 'lucide-react';

const EducationCard = ({ education = [], isOwner, onEdit }) => {
  if (education.length === 0 && !isOwner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-white">Education</h2>
        {isOwner && (
          <button onClick={onEdit} className="p-2 hover:bg-navy-700 rounded-lg transition-colors">
            <Plus className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {education.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Add your education to highlight your academic background.</p>
      ) : (
        <div className="space-y-6">
          {education.map((edu, i) => (
            <div key={edu._id || i} className="flex gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-navy-700 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium">{edu.school}</h3>
                    <p className="text-gray-300 text-sm">
                      {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {edu.startDate && new Date(edu.startDate).getFullYear()}
                      {edu.endDate && ` – ${new Date(edu.endDate).getFullYear()}`}
                    </p>
                    {edu.grade && <p className="text-gray-500 text-xs">Grade: {edu.grade}</p>}
                  </div>
                  {isOwner && (
                    <button className="p-1.5 hover:bg-navy-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                  )}
                </div>
                {edu.description && (
                  <p className="text-gray-400 text-sm mt-2">{edu.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default EducationCard;
