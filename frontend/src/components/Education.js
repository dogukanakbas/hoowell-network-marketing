import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Education = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showExam, setShowExam] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [userProgress, setUserProgress] = useState([]);

  useEffect(() => {
    fetchVideos();
    fetchUserProgress();
  }, [user]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await axios.get('/api/education/progress');
      setUserProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchQuestions = async (videoId) => {
    try {
      const response = await axios.get(`/api/videos/${videoId}/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleVideoComplete = async (videoId) => {
    try {
      await axios.post(`/api/education/video-complete`, { video_id: videoId });
      fetchQuestions(videoId);
      setShowExam(true);
      setCurrentVideo(videoId);
    } catch (error) {
      console.error('Error marking video complete:', error);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitExam = async () => {
    try {
      const response = await axios.post('/api/education/submit-exam', {
        video_id: currentVideo,
        answers: answers
      });

      setExamResult(response.data);
      
      if (response.data.passed) {
        fetchUserProgress();
      }
      
      setAnswers({});
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
  };

  const getVideoProgress = (videoId) => {
    return userProgress.find(p => p.video_id === videoId) || {};
  };

  const canWatchVideo = (videoIndex) => {
    if (videoIndex === 0) return true;
    
    const previousVideo = videos[videoIndex - 1];
    const previousProgress = getVideoProgress(previousVideo?.id);
    
    return previousProgress.exam_passed;
  };

  const getEmbedUrl = (driveUrl) => {
    // Convert Google Drive share URL to embed URL
    const fileId = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : driveUrl;
  };

  // Ödeme bloklu kullanıcılar için uyarı
  if (user.payment_blocked) {
    return (
      <div className="dashboard-card">
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3>⚠️ Erişim Engellendi</h3>
          <p>Ödemeniz reddedilmiştir. Eğitimlere devam edebilmek için lütfen geçerli bir ödeme makbuzu yükleyiniz.</p>
          <a href="/payment" className="btn btn-primary" style={{ marginTop: '15px' }}>
            Ödeme Yap
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-card" style={{ marginBottom: '30px' }}>
        <h3>Eğitim Programı</h3>
        <p>10 video eğitimini tamamlayarak backoffice erişiminizi aktifleştirin.</p>
        
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {videos.map((video, index) => {
              const progress = getVideoProgress(video.id);
              const canWatch = canWatchVideo(index);
              
              return (
                <div
                  key={video.id}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: progress.exam_passed ? '#28a745' : 
                                   progress.watched ? '#ffc107' : 
                                   canWatch ? '#007bff' : '#6c757d',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
          
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            <span style={{ color: '#28a745' }}>●</span> Tamamlandı &nbsp;
            <span style={{ color: '#ffc107' }}>●</span> İzlendi &nbsp;
            <span style={{ color: '#007bff' }}>●</span> Mevcut &nbsp;
            <span style={{ color: '#6c757d' }}>●</span> Kilitli
          </div>
        </div>
      </div>

      {/* Video List */}
      <div className="dashboard-card">
        <h3>Video Eğitimleri</h3>
        
        {videos.map((video, index) => {
          const progress = getVideoProgress(video.id);
          const canWatch = canWatchVideo(index);
          
          return (
            <div 
              key={video.id}
              style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '10px', 
                padding: '20px', 
                marginBottom: '20px',
                opacity: canWatch ? 1 : 0.5
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4>{video.title}</h4>
                <div>
                  {progress.exam_passed && (
                    <span className="status-badge status-approved">Tamamlandı</span>
                  )}
                  {progress.watched && !progress.exam_passed && (
                    <span className="status-badge status-pending">Sınav Bekliyor</span>
                  )}
                  {!canWatch && (
                    <span className="status-badge" style={{ backgroundColor: '#6c757d', color: 'white' }}>
                      Kilitli
                    </span>
                  )}
                </div>
              </div>
              
              <p style={{ color: '#666', marginBottom: '15px' }}>{video.description}</p>
              
              {canWatch && (
                <div>
                  <iframe
                    src={getEmbedUrl(video.google_drive_url)}
                    width="100%"
                    height="400"
                    style={{ border: 'none', borderRadius: '8px' }}
                    title={video.title}
                  ></iframe>
                  
                  {!progress.watched && (
                    <button 
                      className="btn btn-primary"
                      style={{ marginTop: '15px' }}
                      onClick={() => handleVideoComplete(video.id)}
                    >
                      Videoyu Tamamladım
                    </button>
                  )}
                  
                  {progress.watched && !progress.exam_passed && (
                    <button 
                      className="btn btn-gold"
                      style={{ marginTop: '15px' }}
                      onClick={() => {
                        fetchQuestions(video.id);
                        setCurrentVideo(video.id);
                        setShowExam(true);
                      }}
                    >
                      Sınava Gir
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exam Modal */}
      {showExam && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>Video Sınavı</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              10 sorudan en az 7'sini doğru cevaplamanız gerekmektedir.
            </p>

            {examResult ? (
              <div>
                <div style={{
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  backgroundColor: examResult.passed ? '#d4edda' : '#f8d7da',
                  color: examResult.passed ? '#155724' : '#721c24',
                  marginBottom: '20px'
                }}>
                  <h4>{examResult.passed ? 'Tebrikler!' : 'Başarısız'}</h4>
                  <p>Skorunuz: {examResult.score}/10</p>
                  {examResult.passed ? (
                    <p>Sınavı başarıyla geçtiniz. Bir sonraki videoya geçebilirsiniz.</p>
                  ) : (
                    <p>Sınavı geçmek için en az 7 doğru cevap vermelisiniz. Tekrar deneyebilirsiniz.</p>
                  )}
                </div>
                
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setShowExam(false);
                    setExamResult(null);
                    setCurrentVideo(null);
                  }}
                >
                  Kapat
                </button>
              </div>
            ) : (
              <div>
                {questions.map((question, index) => (
                  <div key={question.id} style={{ marginBottom: '25px' }}>
                    <h5>Soru {index + 1}</h5>
                    <p style={{ marginBottom: '15px' }}>{question.question_text}</p>
                    
                    {['a', 'b', 'c', 'd'].map(option => (
                      <label key={option} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          value={option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          style={{ marginRight: '10px' }}
                        />
                        {question[`option_${option}`]}
                      </label>
                    ))}
                  </div>
                ))}
                
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn"
                    style={{ backgroundColor: '#6c757d', color: 'white' }}
                    onClick={() => {
                      setShowExam(false);
                      setAnswers({});
                    }}
                  >
                    İptal
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={submitExam}
                    disabled={Object.keys(answers).length !== questions.length}
                  >
                    Sınavı Bitir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;