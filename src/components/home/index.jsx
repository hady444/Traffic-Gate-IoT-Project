import React, { useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import { FaChevronDown } from 'react-icons/fa';
import AddCar from '../AddCar';
import LogManagement from '../LogManagement';
import PaymentManagement from '../PaymentManagement';
import CarLogPaymentManagement from '../CarLogPaymentMangment';
import DetectionLayout from '../DetectionLayout';
import './styles.css'; // Make sure to import the CSS file

const Home = () => {
  const { currentUser } = useAuth();
  const [showAddCar, setShowAddCar] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [showLogGateAccess, setShowLogGateAccess] = useState(false);

  return (
    <div className='text-2xl font-bold pt-14'>
      <p className="text-center">
        Hello! <span className="user-text">{currentUser.displayName ? currentUser.displayName : currentUser.email}</span> , you are now logged in.
      </p>
      <div>
        <DetectionLayout />
      </div>
      <h1 className="text-3xl font-bold mt-6 text-center">Management</h1>
      <CarLogPaymentManagement />

      <h2 
        className='text-xl font-semibold mt-6 cursor-pointer flex justify-center items-center' 
        onClick={() => setShowAddCar(!showAddCar)}
      >
        Add Car <FaChevronDown className={`ml-2 transition-transform ${showAddCar ? 'rotate-180' : ''}`} />
      </h2>
      <div className={`overflow-hidden transition-all duration-500 ${showAddCar ? 'max-h-screen' : 'max-h-0'}`}>
        {showAddCar && <AddCar />}
      </div>

      <h2 
        className='text-xl font-semibold mt-6 cursor-pointer flex justify-center items-center' 
        onClick={() => setShowRecordPayment(!showRecordPayment)}
      >
        Record Payment <FaChevronDown className={`ml-2 transition-transform ${showRecordPayment ? 'rotate-180' : ''}`} />
      </h2>
      <div className={`overflow-hidden transition-all duration-500 ${showRecordPayment ? 'max-h-screen' : 'max-h-0'}`}>
        {showRecordPayment && <PaymentManagement />}
      </div>

      <h2 
        className='text-xl font-semibold mt-6 cursor-pointer flex justify-center items-center' 
        onClick={() => setShowLogGateAccess(!showLogGateAccess)}
      >
        Log Gate Access <FaChevronDown className={`ml-2 transition-transform ${showLogGateAccess ? 'rotate-180' : ''}`} />
      </h2>
      <div className={`overflow-hidden transition-all duration-500 ${showLogGateAccess ? 'max-h-screen' : 'max-h-0'}`}>
        {showLogGateAccess && <LogManagement />}
      </div>
    </div>
  );
};

export default Home;
