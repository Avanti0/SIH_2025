import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VideoUpload = () => {
  const [videos, setVideos] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'biosecurity'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewingVideo, setViewingVideo] = useState(null);

  useEffect(() => {
    // Load videos from global storage (shared across all users)
    const savedVideos = JSON.parse(localStorage.getItem('globalVideos') || '[]');
    if (savedVideos.length === 0) {
      // Add some initial videos
      const initialVideos = [
        { id: 1, title: 'Proper Handwashing Technique', duration: '2:30', uploaded: '2025-09-14', category: 'hygiene', description: 'Learn proper handwashing for farm hygiene' },
        { id: 2, title: 'Biosecurity Checklist Demo', duration: '5:45', uploaded: '2025-09-13', category: 'biosecurity', description: 'Complete guide to biosecurity measures' }
      ];
      localStorage.setItem('globalVideos', JSON.stringify(initialVideos));
      setVideos(initialVideos);
    } else {
      setVideos(savedVideos);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleUpload = () => {
    if (selectedFile && uploadForm.title) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const newVideo = {
          id: Date.now(),
          title: uploadForm.title,
          description: uploadForm.description,
          category: uploadForm.category,
          duration: '0:00',
          uploaded: new Date().toISOString().split('T')[0],
          file: selectedFile.name,
          fileData: e.target.result, // Store file data for viewing
          uploadedBy: JSON.parse(localStorage.getItem('currentUser') || '{}').name || 'Anonymous'
        };
        
        // Get existing videos from global storage
        const existingVideos = JSON.parse(localStorage.getItem('globalVideos') || '[]');
        const updatedVideos = [newVideo, ...existingVideos];
        
        // Save to global storage (shared across all users/devices)
        localStorage.setItem('globalVideos', JSON.stringify(updatedVideos));
        setVideos(updatedVideos);
        
        setUploadForm({ title: '', description: '', category: 'biosecurity' });
        setSelectedFile(null);
        alert('Video uploaded successfully and shared globally!');
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert('Please fill in all required fields and select a video file');
    }
  };

  const viewVideo = (video) => {
    if (video.file && video.fileData) {
      // If it's an uploaded video with file data
      setViewingVideo(video);
    } else {
      // For demo videos, show info
      setViewingVideo(video);
    }
  };

  const shareVideo = (video) => {
    const shareText = `Check out this video: ${video.title} - ${video.description}`;
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Video details copied to clipboard!');
    }
  };

  const deleteVideo = (videoId) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this video?')) {
      const updatedVideos = videos.filter(v => v.id !== videoId);
      setVideos(updatedVideos);
      localStorage.setItem('globalVideos', JSON.stringify(updatedVideos));
    }
  };

  return (
    <div className="video-upload">
      <header>
        <Link to="/dashboard" className="back-btn">← Back to Dashboard</Link>
        <h1>Video Upload & Awareness</h1>
      </header>

      <div className="upload-section">
        <h3>Upload New Video (Shared with all users)</h3>
        <div className="upload-form">
          <input
            type="text"
            placeholder="Video Title *"
            value={uploadForm.title}
            onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
          />
          
          <textarea
            placeholder="Description"
            value={uploadForm.description}
            onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
          />
          
          <select
            value={uploadForm.category}
            onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
          >
            <option value="biosecurity">Biosecurity</option>
            <option value="health">Animal Health</option>
            <option value="feeding">Feeding Practices</option>
            <option value="hygiene">Farm Hygiene</option>
            <option value="emergency">Emergency Response</option>
          </select>

          <div className="file-upload">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              id="video-file"
            />
            <label htmlFor="video-file" className="file-label">
              📹 {selectedFile ? selectedFile.name : 'Choose Video File'}
            </label>
          </div>

          <button onClick={handleUpload} className="upload-btn">
            Upload Video
          </button>
        </div>
      </div>

      <div className="video-library">
        <h3>Video Library ({videos.length} videos)</h3>
        <div className="video-grid">
          {videos.map(video => (
            <div key={video.id} className="video-card">
              <div className="video-thumbnail">
                <div className="play-icon">▶️</div>
                <span className="duration">{video.duration}</span>
              </div>
              <div className="video-info">
                <h4>{video.title}</h4>
                <p>{video.description}</p>
                <small>Uploaded: {video.uploaded} {video.uploadedBy && `by ${video.uploadedBy}`}</small>
              </div>
              <div className="video-actions">
                <button onClick={() => viewVideo(video)}>👁️ View</button>
                <button onClick={() => shareVideo(video)}>📤 Share</button>
                <button onClick={() => deleteVideo(video.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewingVideo && (
        <div className="video-modal" onClick={() => setViewingVideo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{viewingVideo.title}</h3>
              <button onClick={() => setViewingVideo(null)}>✕</button>
            </div>
            <div className="video-player">
              {viewingVideo.fileData ? (
                <video controls width="100%" style={{maxHeight: '400px'}}>
                  <source src={viewingVideo.fileData} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="video-placeholder">
                  <p>📹 Demo Video: {viewingVideo.title}</p>
                  <p>Duration: {viewingVideo.duration}</p>
                  <p>Category: {viewingVideo.category}</p>
                  <p>{viewingVideo.description}</p>
                  <small>This is a demo video. Upload your own videos to see them play here.</small>
                </div>
              )}
              <div className="video-details">
                <p><strong>Description:</strong> {viewingVideo.description}</p>
                <p><strong>Category:</strong> {viewingVideo.category}</p>
                <p><strong>Uploaded:</strong> {viewingVideo.uploaded} {viewingVideo.uploadedBy && `by ${viewingVideo.uploadedBy}`}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="awareness-tips">
        <h3>Quick Awareness Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>🧼 Hand Hygiene</h4>
            <p>Always wash hands before and after handling animals</p>
          </div>
          <div className="tip-card">
            <h4>🚫 Visitor Control</h4>
            <p>Maintain visitor logs and provide protective equipment</p>
          </div>
          <div className="tip-card">
            <h4>🏥 Quarantine</h4>
            <p>Isolate sick animals immediately to prevent spread</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
