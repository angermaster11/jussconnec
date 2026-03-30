import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';

const AboutSection = ({ bio, isOwner, onEdit }) => {
  if (!bio && !isOwner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-white">About</h2>
        {isOwner && (
          <button onClick={onEdit} className="p-2 hover:bg-navy-700 rounded-lg transition-colors">
            <Pencil className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>
      {bio ? (
        <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{bio}</p>
      ) : (
        <p className="text-gray-500 text-sm italic">Add a summary about yourself to help others learn about you.</p>
      )}
    </motion.div>
  );
};

export default AboutSection;
