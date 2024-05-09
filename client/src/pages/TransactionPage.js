import React, { useState } from 'react';

function TransactionPage() {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [transactions, setTransactions] = useState([]);

  const handleTransaction = (event) => {
    event.preventDefault();

    const newTransaction = {
      productId: productId,
      quantity: quantity,
    };

    setTransactions([...transactions, newTransaction]);

    setProductId('');
    setQuantity('');
  };

  return (
    <div className="font h-screen flex justify-center items-center">
      <div className="max-w-screen-2xl mx-auto -mt-9">
        <h1 className="w-1/8 text-5xl text-center mb-10">Customer Transactions</h1>
        <form className="max-w-md mx-auto flex flex-col" onSubmit={handleTransaction}>
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
          <div className="flex justify-center"> 
            <button 
              type="submit"
              className="bg-blue-300 rounded-full w-3/5 m-2 p-2 text-white hover:bg-blue-600 transition duration-300 ease-in"
            >
              Submit
            </button>
          </div>
        </form>
        {/* Display transaction history */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Transaction History:</h2>
          {transactions.length > 0 ? (
            <ul className="list-disc list-inside">
              {transactions.map((transaction, index) => (
                <li key={index}>
                  Product ID: {transaction.productId}, Quantity: {transaction.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionPage;
