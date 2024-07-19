// src/components/AddCarComponent.js
import React, { useState, useEffect } from 'react';
import { addCar, getAllCars ,logGateAccess} from '../firebase/firebaseOperations';

const AddCar = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [isVip, setIsVip] = useState(false);
  const [notes, setNotes] = useState('');
  const [authorizedToPass, setAuthorizedToPass] = useState(false);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      const carsData = await getAllCars();
      setCars(carsData);
    };


    fetchCars();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
   const carId = await addCar(licensePlate, isVip, authorizedToPass, notes);
    await logGateAccess(carId,authorizedToPass);
    const updatedCars = await getAllCars();
    setCars(updatedCars);
    setLicensePlate('');
    setIsVip(false);
    setAuthorizedToPass(false);
    setNotes('');
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">License Plate:</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">VIP:</label>
          <input
            className="mr-2 leading-tight"
            type="checkbox"
            checked={isVip}
            onChange={(e) => setIsVip(e.target.checked)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Authorized to Pass:</label>
          <input
            className="mr-2 leading-tight"
            type="checkbox"
            checked={authorizedToPass}
            onChange={(e) => setAuthorizedToPass(e.target.checked)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Car
          </button>
        </div>
      </form>

      <div className="max-w-3xl mx-auto p-4 bg-gray-100 rounded shadow-lg mt-8">
        <h1 className="text-2xl font-bold text-center mb-4">Car List</h1>
        <ul className="divide-y divide-gray-300">
          {cars.map((car) => (
            <li key={car.id} className="py-2">
              <p className="text-lg font-semibold">{car.license_plate}</p>
              <p className="text-sm">VIP: {car.is_vip ? 'Yes' : 'No'}</p>
              <p className="text-sm">Authorized to Pass: {car.authorized_to_pass ? 'Yes' : 'No'}</p>
              <p className="text-sm">
                Last Payment Date: {car.last_payment_date ? new Date(car.last_payment_date.toDate()).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm">Notes: {car.notes}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddCar;
