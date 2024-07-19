import React, { useState, useEffect } from 'react';
import { addCar, getAllCars, logGateAccess, getAllLogs, recordPayment, getAllPayments } from '../firebase/firebaseOperations';

const FloatingLabelInput = ({ label, value, onChange, type = 'text', id, required = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-4">
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${value || isFocused ? 'pt-6' : 'pt-2'}`}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
      />
      <label
        className={`absolute left-3 transition-all duration-200 ease-in-out ${value || isFocused ? 'text-xs -top-2 text-gray-700' : 'top-2 text-gray-400'}`}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

const CarLogPaymentManagement = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [isVip, setIsVip] = useState(false);
  const [notes, setNotes] = useState('');
  const [authorizedToPass, setAuthorizedToPass] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [cars, setCars] = useState([]);
  const [logs, setLogs] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      const carsData = await getAllCars();
      const logsData = await getAllLogs();
      const paymentsData = await getAllPayments();
      setCars(carsData);
      setLogs(logsData);
      setPayments(paymentsData);
    };

    fetchAllData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCar = await addCar(licensePlate, isVip, authorizedToPass, notes);

    if (newCar && newCar.id) {
      await logGateAccess(newCar.id, authorizedToPass ? 'Authorized' : 'Unauthorized');
      await recordPayment(newCar.id, parseFloat(paymentAmount));
    }

    const updatedCars = await getAllCars();
    const updatedLogs = await getAllLogs();
    const updatedPayments = await getAllPayments();
    setCars(updatedCars);
    setLogs(updatedLogs);
    setPayments(updatedPayments);

    setLicensePlate('');
    setIsVip(false);
    setAuthorizedToPass(false);
    setNotes('');
    setPaymentAmount('');
  };

  useEffect(() => {
    if (isVip) {
      setAuthorizedToPass(true);
    }
  }, [isVip]);

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="max-w-md mx-auto mb-8">
        <form onSubmit={handleSubmit}>
          <FloatingLabelInput
            label="License Plate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            id="licensePlate"
            required
          />
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vip">
              VIP:
            </label>
            <input
              className="mr-2 leading-tight"
              id="vip"
              type="checkbox"
              checked={isVip}
              onChange={(e) => setIsVip(e.target.checked)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="authorizedToPass">
              Authorized to Pass:
            </label>
            <input
              className="mr-2 leading-tight"
              id="authorizedToPass"
              type="checkbox"
              checked={isVip ? true : authorizedToPass}
              onChange={(e) => setAuthorizedToPass(e.target.checked)}
              disabled={isVip}
            />
          </div>
          <div className="mb-6">
            <FloatingLabelInput
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              id="notes"
              type="textarea"
            />
          </div>
          <div className="mb-6">
            <FloatingLabelInput
              label="Payment Amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              id="paymentAmount"
              type="number"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-x-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">All Cars</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car ID</th>
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Plate</th>
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VIP</th>
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Authorized to Pass</th>
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map(car => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.license_plate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.is_vip ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.is_vip ? 'Yes' : (car.authorized_to_pass ? 'Yes' : 'No')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{car.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">All Logs</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Log ID</th>
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car ID</th>
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.car_id._key.path.segments[6]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-2xl font-bold mb-4">All Payments</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car ID</th>
              <th className="border-b-2 border-gray-200 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map(payment => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.car_id._key.path.segments[6]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{payment.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarLogPaymentManagement;
