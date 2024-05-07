import React, { useState } from 'react';
import Axios from 'axios';

function AddSupplier() {
  const [supplierName, setSupplierName] = useState('');
  const [category, setCategory] = useState('');

  const addSupplier = () => {
    Axios.post('http://localhost:8080/supplier', {
      supplier_name: supplierName,
      category: category
    })
    .then((response) => {
      console.log('Supplier added successfully:', response.data);
      // Handle success, maybe navigate to another screen or show a success message
    })
    .catch((error) => {
      console.error('Error adding supplier:', error);
      // Handle error, display an error message to the user
    });
  };

  const discardSupplier = () => {
    // Implement the functionality to discard supplier here
  };

  return (
    <div className="font h-screen flex justify-center items-center">
      <div className="max-w-screen-2xl mx-auto -mt-9">
        <h1 className="w-1/8 text-5xl text-center mb-10">Add Supplier</h1>
        <form className="max-w-md mx-auto flex flex-col">
          <div className="flex mb-4 items-center">
            <label htmlFor="supplierName" className="w-1/8 text-left mr-2 mb-2 px-3">Supplier Name</label>
            <input 
              type="text"
              id="supplierName"
              placeholder="Supplier Name"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              className="flex-grow px-5 py-2 mb-2 rounded-full border border-gray-300"
            />
          </div>
          <div className="flex mb-4 items-center">
            <label htmlFor="category" className="w-1/8 text-left mr-11 mb-2 px-3">Category</label>
            <input 
              type="text"
              id="category"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-grow px-5 py-2 mb-2 rounded-full border border-gray-300"
            />
          </div>
          <div className="flex justify-center"> 
            <button 
              className="bg-red-300 rounded-full w-3/5 m-2 p-2 text-white hover:bg-red-600 transition duration-300 ease-in"
              onClick={discardSupplier}
            >
              Discard
            </button>
            <button 
              className="bg-blue-300 rounded-full w-3/5 m-2 p-2 text-white hover:bg-blue-600 transition duration-300 ease-in"
              onClick={addSupplier}
            >
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSupplier;