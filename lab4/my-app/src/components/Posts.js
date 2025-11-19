// components/Posts.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './styles/Posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Состояния для работы с изображениями
  const [selectedImage, setSelectedImage] = useState(null);
  const [invertedImageUrl, setInvertedImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Базовый URL нашего FastAPI сервера
  const API_BASE_URL = 'http://localhost:8000';

  // Загрузка постов с нашего сервера
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/posts?limit=${postCount}`);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка постов при монтировании компонента
  useEffect(() => {
    fetchPosts();
  }, [postCount]);

  // Мемоизация отображаемых постов
  const displayedPosts = useMemo(() => {
    return posts;
  }, [posts]);

  // Обработка загрузки изображения
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log(event);

    setSelectedImage(URL.createObjectURL(file));
    setImageLoading(true);
    setImageError(null);
    setInvertedImageUrl(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/invert-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setInvertedImageUrl(`${API_BASE_URL}${response.data.inverted_image_url}`);
    } catch (err) {
      setImageError(err.response?.data?.detail || 'Error processing image');
      console.error('Error uploading image:', err);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="posts-container">
      <h1>Посты и обработка изображений</h1>
      
      {/* Секция постов */}
      <div className="section">
        <h2>Посты с нашего сервера</h2>
        
        <div className="posts-controls">
          <div className="slider-container">
            <label htmlFor="postCount">
              Количество постов: {postCount}
            </label>
            <input
              id="postCount"
              type="range"
              min="1"
              max="20"
              value={postCount}
              onChange={(e) => setPostCount(Number(e.target.value))}
              className="post-slider"
            />
          </div>

          <button onClick={fetchPosts} className="reload-btn" disabled={loading}>
            {loading ? 'Загрузка...' : 'Обновить посты'}
          </button>
        </div>

        {loading && <div className="loading">Загрузка постов...</div>}
        {error && <div className="error">Ошибка: {error}</div>}

        <div className="posts-list">
          {displayedPosts.map(post => (
            <div key={post.id} className="post-card">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-body">{post.body}</p>
              <div className="post-meta">
                <span>ID пользователя: {post.userId}</span>
                <span>ID поста: {post.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Секция обработки изображений */}
      <div className="section">
        <h2>Инверсия изображения</h2>
        
        <div className="image-upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="file-input-label">
            Выберите изображение
          </label>

          {imageLoading && <div className="loading">Обработка изображения...</div>}
          {imageError && <div className="error">Ошибка: {imageError}</div>}

          <div className="image-comparison">
            {selectedImage && (
              <div className="image-container">
                <h4>Оригинал</h4>
                <img src={selectedImage} alt="Original" className="preview-image" />
              </div>
            )}
            
            {invertedImageUrl && (
              <div className="image-container">
                <h4>Инвертированное</h4>
                <img src={invertedImageUrl} alt="Inverted" className="preview-image" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ссылка на API документацию */}
      {/* <div className="section">
        <h2>API Документация</h2>
        <p>
          <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer">
            Открыть Swagger документацию API
          </a>
        </p>
        <p>
          <a href="http://localhost:8000/redoc" target="_blank" rel="noopener noreferrer">
            Открыть ReDoc документацию API
          </a>
        </p>
      </div> */}
    </div>
  );
};

export default Posts;