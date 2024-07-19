import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from "../firebase/firebase"; 
import { collection, query, where, getDocs } from "firebase/firestore"; 

function DetectionLayout() {
  const [plates, setPlates] = useState([]);
  const [ocrResults, setOcrResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authorizationStatus, setAuthorizationStatus] = useState({});

  useEffect(() => {
    startDetection();
    
    return () => setLoading(false);
  }, []);

  const startDetection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/start_detection');
      const plates = response.data.plates;
      const ocrResults = response.data.ocr_results;
      setPlates(plates);
      setOcrResults(ocrResults);
      await checkAuthorization(plates);
    } catch (error) {
      setError('Error starting detection. Please try again.');
      console.error('Error starting detection:', error);
    } finally {
      setLoading(false);
     
      setTimeout(startDetection, 10000); 
    }
  };

  const checkAuthorization = async (plates) => {
    const authorizationResults = {};
    for (const plate of plates) {
      const q = query(collection(db, 'Cars'), where('license_plate', '==', plate));
      const querySnapshot = await getDocs(q);
      let isAuthorized = false;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        isAuthorized = data.authorized_to_pass;
      });

      authorizationResults[plate] = isAuthorized;
    }
    setAuthorizationStatus(authorizationResults);
  };

  return (
    <div className="App">
      <h1 className="text-3xl font-bold mb-4">Number Plate Detection</h1>
      {loading && <p className="text-blue-500">Detecting...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plates.map((plate, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <img
              src={`http://localhost:5000/plates/${plate}`}
              alt={`Plate ${index}`}
              className="w-full h-auto mb-2"
            />
            <p className="text-lg">
              OCR Result: {ocrResults.find(result => result.filename === plate)?.text || 'N/A'}
            </p>
            {authorizationStatus[plate] !== undefined && (
              <p className={`text-lg font-semibold ${authorizationStatus[plate] ? 'text-green-500' : 'text-red-500'}`}>
                {authorizationStatus[plate] ? 'Authorized' : 'Not Authorized'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DetectionLayout;
