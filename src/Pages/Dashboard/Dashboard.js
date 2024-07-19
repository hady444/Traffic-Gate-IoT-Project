// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';
import 'chartjs-adapter-date-fns';
import './Dashboard.css';


 function Widget({cars,payment,gateLog}) {
  let TotalPayment = 0;
  (payment).forEach(ele => {
    TotalPayment = TotalPayment + ele.amount
    
  })
  return (
      <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-8">Smartgate Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105">
                  <h2 className="text-xl font-semibold mb-2">Total Cars</h2>
                  <p className="text-zinc-600">{cars.length}</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105">
                  <h2 className="text-xl font-semibold mb-2">Total Payments</h2>
                  <p className="text-zinc-600">${TotalPayment}</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6 transform transition duration-300 hover:scale-105">
                  <h2 className="text-xl font-semibold mb-2">Gate Logs</h2>
                  <p className="text-zinc-600">{gateLog.length}</p>
              </div>
          </div>
      

      

      </div>
  )
}

const Dashboard = () => {
  const [carData, setCarData] = useState([]);
  const [gateLogs, setGateLogs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carSnapshot = await getDocs(collection(db, 'Cars'));
        const gateLogSnapshot = await getDocs(collection(db, 'GateLogs'));
        const paymentSnapshot = await getDocs(collection(db, 'Payments'));

        const cars = carSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const logs = gateLogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const payments = paymentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setCarData(cars);
        setGateLogs(logs);
        setPayments(payments);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (gateLogs.length > 0) {
      const ctx = document.getElementById('authChart').getContext('2d');

      const authorized = gateLogs.filter(log => log.status === 'Authorized').length;
      const unauthorized = gateLogs.filter(log => log.status !== 'Authorized').length;

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Authorized', 'Unauthorized'],
          datasets: [{
            data: [authorized, unauthorized],
            backgroundColor: ['green', 'red']
          }]
        },
        options: {
          plugins: {
            datalabels: {
              color: '#fff',
              display: true,
              font: {
                weight: 'bold'
              }
            }
          }
        }
      });
    }
  }, [gateLogs]);
  useEffect(() => {
    if (payments.length > 0) {
      const canvas = document.getElementById('incomeChart');
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Context not found');
        return;
      }

      const paymentDates = payments.map(payment => payment.payment_date.toDate().toLocaleDateString());
      const paymentAmounts = payments.map(payment => payment.amount);

      console.log('Payment Dates:', paymentDates);
      console.log('Payment Amounts:', paymentAmounts);

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: paymentDates,
          datasets: [{
            label: 'Total Income',
            data: paymentAmounts,
            borderColor: 'blue',
            fill: false
          }]
        },
        options: {
          scales: {

          }
        }
      });
    }
  }, [payments]);
  const authorizedCount = gateLogs.filter(log => log.status === 'Authorized').length;
  const unauthorizedCount = gateLogs.filter(log => log.status !== 'Authorized').length;

  if (error) {
    return <div className="dashboard-error">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Smart Gate Dashboard</h1>
      <Widget cars={carData} payment={payments} gateLog={gateLogs}/>
      <div className="chart-container">
        <canvas id="authChart"></canvas>
      </div>
      <div className="chart-container">
        <canvas id="incomeChart"></canvas>
      </div>
      <div className="table-container">
        <h2>Gate Logs Summary</h2>
        <table className='min-w-full bg-white border border-gray-200'>
          <thead>
            <tr className='bg-gray-100'>
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Authorized</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{authorizedCount}</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Unauthorized</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{unauthorizedCount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
