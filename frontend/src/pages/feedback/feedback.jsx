import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import 'w3-css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

const ContactForm = () => {
  const [user_email, setUserEmail] = useState('');
  const [user_message, setUserMessage] = useState(null);

  const navigate = useNavigate();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (user_message != null) {
      try {
          const response = await axios.post('http://127.0.0.1:8000/components/api/report_problem',
            {
              "user_email": user_email,
              "user_message": user_message,
            }
          );
          console.log("Message = ", user_message);
          if (response.status === 200) {
            navigate('/search');
        }
        // else {
        //   setErrorMessage('Неправильний логін або пароль');
        // }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };
  
  return (
    <div className="container" style={{ paddingTop: "50px" }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-header bg-dark text-white">
              <h4 align="center" className="mb-0">Повідомити про проблему</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSendMessage}>
                <div className="form-group">
                  <input 
                    type="email" 
                    className="form-control" 
                    id="user_email" 
                    aria-describedby="emailHelp" 
                    placeholder="Введіть вашу електронну пошту" 
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ paddingTop: "20px" }}>
                  <textarea 
                    className="form-control" 
                    id="user_message" 
                    rows="5" 
                    placeholder="Введіть ваше повідомлення"
                    onChange={(e) => setUserMessage(e.target.value)}
                  ></textarea>
                </div>
                <div align="center" style={{ paddingTop: "20px" }}>
                  <button type="submit" class="btn btn-dark">Надіслати</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Feedback = () => {
  const [data, setData] = useState(null);

  return (
    <div className="product-info" style={{paddingTop: "90px"}}>
      <ContactForm />
    </div>
  );
};
