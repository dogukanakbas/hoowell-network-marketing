import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionManager = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [questions, setQuestions] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVideo || !questions.trim()) {
      setMessage('Video seçin ve soruları girin');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Parse questions from text format
      const questionLines = questions.trim().split('\n');
      const parsedQuestions = [];
      
      let currentQuestion = null;
      
      for (let line of questionLines) {
        line = line.trim();
        if (!line) continue;
        
        if (line.includes('?')) {
          // This is a question
          if (currentQuestion) {
            parsedQuestions.push(currentQuestion);
          }
          currentQuestion = {
            text: line,
            a: '',
            b: '',
            c: '',
            d: '',
            correct: ''
          };
        } else if (line.startsWith('a-') || line.startsWith('a)')) {
          if (currentQuestion) currentQuestion.a = line.substring(2).trim();
        } else if (line.startsWith('b-') || line.startsWith('b)')) {
          if (currentQuestion) currentQuestion.b = line.substring(2).trim();
        } else if (line.startsWith('c-') || line.startsWith('c)')) {
          if (currentQuestion) currentQuestion.c = line.substring(2).trim();
        } else if (line.startsWith('d-') || line.startsWith('d)')) {
          if (currentQuestion) currentQuestion.d = line.substring(2).trim();
        } else if (line.startsWith('cevap') || line.startsWith('Cevap')) {
          if (currentQuestion) {
            const answer = line.split(/[:\s]+/)[1];
            currentQuestion.correct = answer.toLowerCase();
          }
        }
      }
      
      if (currentQuestion) {
        parsedQuestions.push(currentQuestion);
      }

      const response = await axios.post('/api/admin/questions/bulk', {
        video_id: selectedVideo,
        questions: parsedQuestions
      });

      setMessage(response.data.message);
      setQuestions('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Sorular eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card">
      <h3>Soru Yönetimi</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Video Seçin</label>
          <select 
            className="form-control"
            value={selectedVideo}
            onChange={(e) => setSelectedVideo(e.target.value)}
            required
          >
            <option value="">Video seçin...</option>
            {videos.map((video) => (
              <option key={video.id} value={video.id}>
                Video {video.order_number}: {video.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Sorular (Metin formatında)</label>
          <textarea
            className="form-control"
            rows="20"
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Soruları şu formatta girin:

Soru metni burada?
a-Seçenek A
b-Seçenek B  
c-Seçenek C
d-Seçenek D
cevap: b

İkinci soru burada?
a-Seçenek A
b-Seçenek B
c-Seçenek C
d-Seçenek D
cevap: a"
            required
          />
        </div>

        {message && (
          <div style={{ 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px',
            backgroundColor: message.includes('başarıyla') ? '#d4edda' : '#f8d7da',
            color: message.includes('başarıyla') ? '#155724' : '#721c24'
          }}>
            {message}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Ekleniyor...' : 'Soruları Ekle'}
        </button>
      </form>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>Kullanım Talimatları:</h4>
        <ul>
          <li>Her soru bir satırda olmalı ve soru işareti (?) ile bitmeli</li>
          <li>Seçenekler a-, b-, c-, d- ile başlamalı</li>
          <li>Doğru cevap "cevap: a" formatında belirtilmeli</li>
          <li>Sorular arasında boş satır bırakabilirsiniz</li>
          <li>Her video için maksimum 20 soru ekleyebilirsiniz</li>
        </ul>
      </div>
    </div>
  );
};

export default QuestionManager;