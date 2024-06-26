import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    Axios.get('http://localhost:8080/products', { withCredentials: true }).then(({ data }) => {
      setProducts(data);
      setLoading(false);
      extractCategories(data);
    })
    .catch(error => {
      console.error('Error fetching products:', error);
      setLoading(false);
    });
  }, []);

  function extractCategories(products) {
    console.log(products)
    const categorySet = new Set();
    products.forEach(product => {
      if (product.CATEGORY_NAME && !categorySet.has(product.CATEGORY_NAME)) {
        categorySet.add(product.CATEGORY_NAME);
      }
    });
    setCategories([...categorySet]);
  }
  
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.CATEGORY_NAME === selectedCategory)
    : products;

  return (
    <div className="mx-4 font mt-12 h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-5xl">Inventory</h1>
      </div>

      <div className="text-left m-4">
        <div className="mb-4">
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel htmlFor="category-select">Select Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              fullWidth
              label="Select Category"
              inputProps={{
                name: 'category',
                id: 'category-select',
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {/* Render unique category headings */}
            {Array.from(new Set(products.map((product) => product.CATEGORY_NAME))).map((categoryName) => (
              <div key={categoryName} className="m-4">
                {(!selectedCategory || categoryName === selectedCategory) && (
                  <>
                  <h2 className="text-4xl underline mb-4">{categoryName}</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Render products for the current category */}
                      {filteredProducts
                        .filter((product) => product.CATEGORY_NAME === categoryName)
                        .map((product) => (
                          <React.Fragment key={product.PRODUCT_ID}>
                            <table className="table-auto border-collapse ">
                              <thead>
                                <tr className="bg-blue-300 bg-opacity-50">
                                  <th className="px-8 py-2">Product Name</th>
                                  <th className="px-8 py-2">Product ID</th>
                                  <th className="px-8 py-2">Description</th>
                                  <th className="px-8 py-2">Quantity</th>
                                  <th className="px-8 py-2">Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                  <tr key={product.PRODUCT_ID}>
                                    <td className="px-8 py-2">{product.PRODUCT_NAME}</td>
                                    <td className="px-8 py-2">{product.PRODUCT_ID}</td>
                                    <td className="px-8 py-2">{product.PRODUCT_DESCRIPTION}</td>
                                    <td className="px-8 py-2">{product.QUANTITY}</td>
                                    <td className="px-8 py-2">{product.PRICE}</td>
                                  </tr>
                              </tbody>
                            </table>
                          </React.Fragment>
                        ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;
