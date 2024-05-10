import React, { useState } from 'react';
import Axios from 'axios';

function TransactionPage() {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [lastTransaction, setLastTransaction] = useState(null);

  const handleTransaction = async(event) => {
    event.preventDefault(); // Prevent default form submission behavior

     //error handling
     const errors = [];

     if (!productId || !quantity || !firstName || !lastName || !email || !phone || !address || !paymentMethod) {
         errors.push('Please fill in all fields.');
     }
     //checking for correct format / data type
     else {
        if (isNaN(parseInt(quantity)) || parseInt(quantity) < 0) {
            errors.push('Please enter a valid number for Quantity.');
        }
         const phoneRegex = /^\d{10}$/; 
         if (!phoneRegex.test(phone)) {
             errors.push('Please enter a valid 10-digit phone number.');
         }
     }
    //create alert for errors
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    try {
      await Axios.post(`http://localhost:8080/sales`, {
          product_id: productId,
          quantity: quantity,
          payment_details: paymentMethod
      }, { withCredentials: true });

      await Axios.post('http://localhost:8080/customers', {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          address: address
      }, { withCredentials: true });

      setLastTransaction({
          productId,
          quantity: parseInt(quantity),
          firstName,
          lastName,
          email,
          phone,
          address,
          paymentMethod,
      });
    } catch (error) {
        if (error.response) {
            alert('Error: ' + error.response.data.message);
        } else {
            alert('Product does not exist. Try again.');
        }
    }

  setProductId('');
  setQuantity('');
  setFirstName('');
  setLastName('');
  setEmail('');
  setPhone('');
  setAddress('');
  setPaymentMethod('');
};

  return (
    <div className="font h-screen flex justify-center items-center">
      <div className="max-w-screen-2xl mx-auto -mt-9">
        <h1 className="w-1/8 text-5xl text-center mb-10">Customer Transactions</h1>
        <form className="max-w-md mx-auto flex flex-col" onSubmit={handleTransaction}>
          {/* Input fields for product ID and quantity */}
          <div className="flex mb-4 items-center">
            <label htmlFor="productId" className="w-1/8 text-left mr-2 mb-2 px-3">Product ID</label>
            <input 
              type="text"
              id="productId"
              placeholder="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="flex-grow px-5 py-2 mb-2 rounded-full border border-gray-300"
            />
          </div>
          <div className="flex mb-4 items-center">
            <label htmlFor="quantity" className="w-1/8 text-left mr-11 mb-2 px-3">Quantity</label>
            <input 
              type="text"
              id="quantity"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="flex-grow px-5 py-2 mb-2 rounded-full border border-gray-300"
            />
          </div>

          {/* Input fields for customer information */}
          <div className="flex mb-4 items-center">
            <label htmlFor="firstName" className="w-1/8 text-left mr-2 mb-2 px-3">First Name</label>
            <input 
              type="text"
              id="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="flex-grow px-5 py-2 mb-2 rounded-full border border-gray-300"
            />
            <label htmlFor="lastName" className="w-1/8 text-left mr-2 mb-2 px-3">Last Name</label>
            <input 
              type="text"
              id="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="flex-grow px-5 py-2 mb-2 rounded-full border border-gray-300"
            />
          </div>
          <div className="flex mb-4 items-center">
            <label htmlFor="email" className="w-1/8 text-left mr-2 mb-2 px-3">Email</label>
            <input 
              type="text"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-5 py-2 mb-2 rounded-full border border-gray-300"
            />
            <label htmlFor="phone" className="w-1/8 text-left mr-2 mb-2 px-3">Phone</label>
            <input 
              type="text"
              id="phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-grow px-5 py-2 mb-2 rounded-full border border-gray-300"
            />
          </div>
          <div className="flex mb-4 items-center">
            <label htmlFor="address" className="w-1/8 text-left mr-2 mb-2 px-3">Address</label>
            <input 
              type="text"
              id="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-grow px-5 py-2 mb-2 rounded-full border border-gray-300"
            />
            <label htmlFor="paymentMethod" className="w-1/8 text-left mr-2 mb-2 px-3">Payment Method</label>
            <input 
              type="text"
              id="paymentMethod"
              placeholder="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="flex-grow px-5 py-2 mb-2 rounded-full border border-gray-300"
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-center"> 
            <button 
              type="submit"
              className="bg-blue-300 rounded-full w-3/5 m-2 p-2 text-white hover:bg-blue-600 transition duration-300 ease-in"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Display last transaction recorded */}
        <div className="mt-8">
          <h2 className="text-4xl flex justify-center font-bold mb-4">Last Transaction Recorded:</h2>
          {lastTransaction ? (
            <table className="table-auto border-collapse ">
            <thead>
              <tr className="bg-blue-300 bg-opacity-50">
                <th className="px-8 py-2 border-2">Product ID</th>
                <th className="px-8 py-2 border-2">Quantity</th>
                <th className="px-8 py-2 border-2">First Name</th>
                <th className="px-8 py-2 border-2">Last Name</th>
                <th className="px-8 py-2 border-2">Email</th>
                <th className="px-8 py-2 border-2">Phone</th>
                <th className="px-8 py-2 border-2">Address</th>
                <th className="px-8 py-2 border-2">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-8 py-2 border-2">{lastTransaction.productId}</td>
                <td className="px-8 py-2 border-2">{lastTransaction.quantity}</td>
                <td className="px-8 py-2 border-2">{lastTransaction.firstName}</td>
                <td className="px-8 py-2 border-2">{lastTransaction.lastName}</td>
                <td className="px-8 py-2 border-2">{lastTransaction.email}</td>
                <td className="px-8 py-2 border-2">{lastTransaction.phone}</td>
                <td className="px-8 py-2 border-2">{lastTransaction.address}</td>
                <td className="px-8 py-2 border-2">{lastTransaction.paymentMethod}</td>
              </tr>
            </tbody>
          </table>
          ) : (
            <p>No transactions recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;
