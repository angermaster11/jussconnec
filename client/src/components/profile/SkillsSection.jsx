import { motion } from 'framer-motion';
import { Pencil, Plus, Badge } from 'lucide-react';

const SkillsSection = ({ skills = [], isOwner, onEdit }) => {
  if (skills.length === 0 && !isOwner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-white">Skills</h2>
        {isOwner && (
          <button onClick={onEdit} className="p-2 hover:bg-navy-700 rounded-lg transition-colors">
            <Plus className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {skills.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Add your skills to help others know your strengths.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors cursor-default"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SkillsSection;
