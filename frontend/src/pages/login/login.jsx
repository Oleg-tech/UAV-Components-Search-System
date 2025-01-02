import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://127.0.0.1:8000/components/api/token/',
          {
            "username": username,
            "password": password,
          }
        );
    
        if (response.status === 200) {
          const { access, refresh } = response.data;
          localStorage.setItem('accessToken', access);
          localStorage.setItem('refreshToken', refresh);
          localStorage.setItem('isAuthenticated', 'true');

          navigate('/admin');
      } else {
        setErrorMessage('Неправильний логін або пароль');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Виникла помилка під час входу');
    }
  };

  return (
    <div className="container" style={{ paddingTop: "70px" }}>
      <div className="row justify-content-center mt-5">
        <div className="col-md-4">
          <div className="card bg-light">
            <div className="card-header bg-dark text-white">
              <h4 className="mb-0">Вхід</h4>
            </div>
            <div className="card-body">
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleLogin}>
                <div className="form-group" style={{ marginTop: "10px" }}>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Введіть логін"
                  />
                </div>
                <div className="form-group" style={{ marginTop: "20px" }}>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введіть пароль"
                  />
                </div>
                <button type="submit" className="btn btn-dark btn-block" style={{ marginTop: "20px" }}>
                  Увійти
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
