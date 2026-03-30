import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Video, FileText, BarChart3, X, Globe, Lock, Users } from 'lucide-react';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import Modal from '../common/Modal';
import { createPost } from '../../features/posts/postsSlice';

const visibilityOptions = [
  { value: 'public', label: 'Anyone', icon: Globe },
  { value: 'connections', label: 'Connections', icon: Users },
  { value: 'private', label: 'Only me', icon: Lock },
];

const CreatePost = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.posts);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState(1);
  const fileRef = useRef(null);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    const newPreviews = selected.map((f) => ({
      url: URL.createObjectURL(f),
      type: f.type.startsWith('video') ? 'video' : 'image',
      name: f.name,
    }));
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const addPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const reset = () => {
    setContent('');
    setFiles([]);
    setPreviews([]);
    setShowPoll(false);
    setPollOptions(['', '']);
    setVisibility('public');
    setIsOpen(false);
  };

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0 && !showPoll) return;

    const formData = new FormData();
    formData.append('content', content);
    formData.append('visibility', visibility);

    if (files.length > 0) {
      formData.append('postType', files[0].type.startsWith('video') ? 'video' : 'image');
      files.forEach((f) => formData.append('media', f));
    }

    if (showPoll) {
      formData.append('postType', 'poll');
      formData.append('pollOptions', JSON.stringify(pollOptions.filter(Boolean)));
      const endsAt = new Date(Date.now() + pollDuration * 24 * 60 * 60 * 1000).toISOString();
      formData.append('pollEndsAt', endsAt);
    }

    try {
      await dispatch(createPost(formData)).unwrap();
      reset();
    } catch (err) {
      // handled by slice
    }
  };

  return (
    <>
      {/* Trigger bar */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3">
          <Avatar src={user?.profilePicture} name={`${user?.firstName} ${user?.lastName}`} size="md" />
          <button
            onClick={() => setIsOpen(true)}
            className="flex-1 text-left px-4 py-3 bg-navy-800 hover:bg-navy-700 rounded-full text-gray-400 text-sm transition-colors"
          >
            What's on your mind?
          </button>
        </div>
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-navy-700">
          <button onClick={() => { setIsOpen(true); setTimeout(() => fileRef.current?.click(), 100); }}
            className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-navy-800 text-gray-400 text-sm transition-colors">
            <Image className="h-5 w-5 text-blue-400" /> Photo
          </button>
          <button onClick={() => { setIsOpen(true); setTimeout(() => fileRef.current?.click(), 100); }}
            className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-navy-800 text-gray-400 text-sm transition-colors">
            <Video className="h-5 w-5 text-green-400" /> Video
          </button>
          <button onClick={() => { setIsOpen(true); setShowPoll(true); }}
            className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-navy-800 text-gray-400 text-sm transition-colors">
            <BarChart3 className="h-5 w-5 text-orange-400" /> Poll
          </button>
          <button onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 flex-1 justify-center py-2 rounded-lg hover:bg-navy-800 text-gray-400 text-sm transition-colors">
            <FileText className="h-5 w-5 text-purple-400" /> Article
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      <Modal isOpen={isOpen} onClose={reset} title="Create Post" size="lg">
        <div className="space-y-4">
          {/* Author & Visibility */}
          <div className="flex items-center gap-3">
            <Avatar src={user?.profilePicture} name={`${user?.firstName} ${user?.lastName}`} size="md" />
            <div>
              <p className="text-white font-medium text-sm">{user?.firstName} {user?.lastName}</p>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="bg-navy-700 text-gray-400 text-xs rounded-md px-2 py-1 border border-navy-600 mt-0.5"
              >
                {visibilityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts, insights, or news..."
            className="w-full bg-transparent text-white placeholder-gray-500 resize-none min-h-[150px] outline-none text-sm"
            autoFocus
          />

          {/* File Previews */}
          <AnimatePresence>
            {previews.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-2">
                {previews.map((p, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden bg-navy-800 aspect-video">
                    {p.type === 'video' ? (
                      <video src={p.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={p.url} alt="" className="w-full h-full object-cover" />
                    )}
                    <button onClick={() => removeFile(i)}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80">
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Poll */}
          {showPoll && (
            <div className="bg-navy-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">Poll</h4>
                <button onClick={() => setShowPoll(false)} className="text-gray-500 hover:text-gray-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {pollOptions.map((opt, i) => (
                <input
                  key={i}
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[i] = e.target.value;
                    setPollOptions(next);
                  }}
                  placeholder={`Option ${i + 1}`}
                  className="w-full input-field text-sm"
                />
              ))}
              {pollOptions.length < 5 && (
                <button onClick={addPollOption} className="text-primary text-sm hover:underline">+ Add option</button>
              )}
              <select value={pollDuration} onChange={(e) => setPollDuration(Number(e.target.value))}
                className="bg-navy-700 text-gray-300 text-sm rounded-lg px-3 py-2 border border-navy-600 w-full">
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>1 week</option>
                <option value={14}>2 weeks</option>
              </select>
            </div>
          )}

          {/* Toolbar & Submit */}
          <div className="flex items-center justify-between pt-3 border-t border-navy-700">
            <div className="flex items-center gap-1">
              <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
              <button onClick={() => fileRef.current?.click()}
                className="p-2 hover:bg-navy-700 rounded-lg transition-colors">
                <Image className="h-5 w-5 text-blue-400" />
              </button>
              <button onClick={() => setShowPoll(!showPoll)}
                className="p-2 hover:bg-navy-700 rounded-lg transition-colors">
                <BarChart3 className="h-5 w-5 text-orange-400" />
              </button>
            </div>
            <Button
              variant="gradient"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!content.trim() && files.length === 0 && !showPoll}
            >
              Post
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreatePost;
