import React, { useState, useEffect } from 'react';
import { recordPayment, getAllPayments } from '../firebase/firebaseOperations';

const PaymentsManagement = () => {
  const [carId, setCarId] = useState('');
  const [amount, setAmount] = useState('');
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsData = await getAllPayments();
        setPayments(paymentsData);
      } catch (error) {
        console.error('Error fetching payments: ', error);
      }
    };

    fetchPayments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await recordPayment(carId, parseFloat(amount));
    const updatedPayments = await getAllPayments();
    setPayments(updatedPayments);
    setCarId('');
    setAmount('');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="max-w-md mx-auto mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Car ID:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={carId}
              onChange={(e) => setCarId(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Amount:</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">All Payments</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border text-left px-8 py-2">Payment ID</th>
              <th className="border text-left px-8 py-2">Car ID</th>
              <th className="border text-left px-8 py-2">Amount</th>
              {/* Add more headers as per your payment data structure */}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="border px-8 py-2">{payment.id}</td>
                <td className="border px-8 py-2">{payment.carId}</td>
                <td className="border px-8 py-2">{payment.amount}</td>
                {/* Render additional fields here */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsManagement;
