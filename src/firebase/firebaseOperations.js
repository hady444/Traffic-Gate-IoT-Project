// src/firestoreOperations.js
import { collection, addDoc, updateDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Adding a car
export const addCar = async (licensePlate, isVip,isAuth, notes) => {
  try {
    const docRef = await addDoc(collection(db, "Cars"), {
      license_plate: licensePlate,
      is_vip: isVip,
      authorized_to_pass: isAuth,
      last_payment_date: null,
      notes: notes
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
  
};

// Recording a payment
export const recordPayment = async (carId, amount) => {
  const paymentDate = new Date();
  try {
    const paymentRef = await addDoc(collection(db, "Payments"), {
      car_id: doc(db, "Cars", carId),
      amount: amount,
      payment_date: paymentDate
    });
    console.log("Document written with ID: ", paymentRef.id);

    const carRef = doc(db, "Cars", carId);
    await updateDoc(carRef, {
      last_payment_date: paymentDate,
      authorized_to_pass: true
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }

};

// Logging gate access
export const logGateAccess = async (carId, status) => {
  const entryTime = new Date();
  try {
    const logRef = await addDoc(collection(db, "GateLogs"), {
      car_id: doc(db, "Cars", carId),
      entry_time: entryTime,
      exit_time: null,
      status: status
    });
    console.log("Document written with ID: ", logRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }

};



// Getting all cars
export const getAllCars = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Cars"));
      const cars = [];
      querySnapshot.forEach((doc) => {
        cars.push({ id: doc.id, ...doc.data() });
      });
      console.log("Cars data:", cars);
      return cars;
    } catch (error) {
      console.error("Error getting documents:", error);
    }
  };
  
  // Getting all payments
  export const getAllPayments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Payments"));
      const payments = [];
      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      console.log("Payments data:", payments);
      return payments;
    } catch (error) {
      console.error("Error getting documents:", error);
    }
  };
  
  // Getting all gate logs
  export const getAllLogs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "GateLogs"));
      const logs = [];
      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      console.log("Gate logs data:", logs);
      return logs;
    } catch (error) {
      console.error("Error getting documents:", error);
    }
  };