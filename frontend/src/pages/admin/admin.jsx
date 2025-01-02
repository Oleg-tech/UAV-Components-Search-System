import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { PrivateRoute } from './privateComp';

import 'w3-css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

axios.defaults.withCredentials = true;

const fetchShopsData = async () => {
  const url = "http://127.0.0.1:8000/components/api/admin";
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log("Admin data:\n", response.data);

    if (response.status === 403) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

const downloadFile = async (shop_url) => {
  const url = "http://127.0.0.1:8000/components/api/admin";
  const accessToken = localStorage.getItem('accessToken');

  const data = {
    "operation": "download",
    "shop_url": shop_url
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};

export const Admin = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogin = async () => {
      try {
        const result = await fetchShopsData();

        if (result === null) {
          navigate('/login');
        } else {
          setShops(result.shops);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchLogin();
  }, []);

  const handleFileChange = async (e) => {
    const accessToken = localStorage.getItem('accessToken');
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('operation', 'add');
      formData.append('filename', selectedFile.name);
      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.post("http://127.0.0.1:8000/components/api/admin", formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File successfully sent:', response.data);
    } catch (error) {
      console.error('Error sending file:', error);
    }
  };

  const handleDownload = async (shop_url) => {
    try {
      const result = await downloadFile(shop_url);
      const jsonData = JSON.stringify(result.data.data);
      const fileName = result.data.file_name;
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
  
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleSendFile = async (e, base_url) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const file = e.target.files[0];

      if (!file) {
        console.error('No file selected');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append("operation", "send");
      formData.append("shop_url", base_url);
  
      const url = "http://127.0.0.1:8000/components/api/admin";
  
      const response = await axios.post(url, formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log("Файл успішно відправлений", response.data);
    } catch (error) {
      console.error('Error sending file:', error);
    }
  };  

  const handleDelete = async (shop_url) => {
    try {
      const data = {
        "operation": "delete",
        "shop_url": shop_url
      };
      
      const accessToken = localStorage.getItem('accessToken');

      const url = "http://127.0.0.1:8000/components/api/admin";
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      console.log("Файл успішно видалений", response.data);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <PrivateRoute>
      <div className="container" style={{ paddingTop: "90px" }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>

          <div  className="row">
            <div className="col-md-6" style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
              <button className="btn btn-success">Додати</button>
              <input type="file" style={{ position: 'absolute', top: 0, right: 0, minWidth: '100%', minHeight: '100%', fontSize: '100px', textAlign: 'right', opacity: 0, outline: 'none', cursor: 'inherit' }} onChange={handleFileChange} />
            </div>

            <div className="col-md-6 d-flex justify-content-end align-items-center" style={{ paddingTop: "0px", paddingRight: "50px" }}>
              <Link to="/admin/check_messages" className="btn btn-primary">
                Повідомлення від користувачів
              </Link>
            </div>
          </div>

          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Назва</th>
                <th scope="col">Посилання</th>
                <th scope="col">Країна</th>
                <th scope="col">Завантажити</th>
                <th scope="col">Редагувати</th>
                <th scope="col">Видалити</th>
              </tr>
            </thead>
            <tbody className="thead-light">
              {shops.map(shop => (
                <tr key={shop.name}>
                  <td>{shop.name}</td>
                  <td>{shop.base_url}</td>
                  <td>{shop.country}</td>
                  <td>
                    <button className="btn btn-primary" 
                      onClick={() => handleDownload(shop.base_url)}
                    >
                      Завантажити
                    </button>
                  </td>
                  <td>
                    <div align="center" style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                      <button className="btn btn-warning">Оновити</button>
                      <input type="file" style={{ position: 'absolute', top: 0, right: 0, minWidth: '100%', minHeight: '100%', fontSize: '100px', textAlign: 'right', opacity: 0, outline: 'none', cursor: 'inherit' }} onChange={(e) => handleSendFile(e, shop.base_url)} />
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-danger" 
                      onClick={() => handleDelete(shop.base_url)}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </PrivateRoute>
  );
};

