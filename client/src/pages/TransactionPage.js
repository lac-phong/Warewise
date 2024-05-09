import React, { useState } from 'react';

function TransactionPage() {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [lastTransaction, setLastTransaction] = useState(null);

  const handleTransaction = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const newTransaction = {
      productId: productId,
      quantity: quantity,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      address: address,
      paymentMethod: paymentMethod,
      orderDate: orderDate,
    };

    setLastTransaction(newTransaction);

    // Clear input fields after submitting
    setProductId('');
    setQuantity('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setPaymentMethod('');
    setOrderDate('');
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
          <div className="flex mb-4 items-center">
            <label htmlFor="orderDate" className="w-1/8 text-left mr-2 mb-2 px-3">Order Date</label>
            <input 
              type="text"
              id="orderDate"
              placeholder="Order Date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
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
          <h2 className="text-2xl font-bold mb-4">Last Transaction Recorded:</h2>
          {lastTransaction ? (
            <div className="flex">
              <p className="mr-4">
                Product ID: {lastTransaction.productId}, Quantity: {lastTransaction.quantity}
              </p>
              <p className="mr-4">
                Customer: {lastTransaction.firstName} {lastTransaction.lastName}, Email: {lastTransaction.email}, Phone: {lastTransaction.phone}
              </p>
              <p>
                Address: {lastTransaction.address}, Payment Method: {lastTransaction.paymentMethod}, Order Date: {lastTransaction.orderDate}
              </p>
            </div>
          ) : (
            <p>No transactions recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;
