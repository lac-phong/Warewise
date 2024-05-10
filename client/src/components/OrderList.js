import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [supplierNames, setSupplierNames] = useState({});

    const fetchOrders = async () => {
        try {
            const response = await Axios.get('http://localhost:8080/orders', { withCredentials: true });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    };
    
    const fetchSupplierData = async (orders) => {
        const supplierNamesMap = {};
        for (const order of orders) {
            // Fetch supplier details for each order
            const supplierResponse = await Axios.get(`http://localhost:8080/supplier/${order.ORDER_ID}`, { withCredentials: true });
            const supplierId = supplierResponse.data.SUPPLIER_ID;
            
            // Check if supplierId is set
            if (supplierId) {
                // Fetch supplier name using the obtained supplierId
                const supplierNameResponse = await Axios.get(`http://localhost:8080/suppliers/${supplierId}`, { withCredentials: true });

                const supplierName = supplierNameResponse.data.SUPPLIER_NAME;
                // Update supplierNamesMap with the obtained supplierName
                supplierNamesMap[order.ORDER_ID] = supplierName;
            }
        }
        // Set the final supplier names map
        setSupplierNames(supplierNamesMap);
    };
    
    

    useEffect(() => {
        const fetchData = async () => {
        try {
            await fetchOrders();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
        fetchData();
    }, []);

    useEffect(() => {
        try {
            console.log(orders)
            fetchSupplierData(orders)
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    }, [orders])
    
    return (
        <div className="min-w-full overflow-y-auto">
          <table className="table-auto border-collapse ">
            <thead>
              <tr className="bg-blue-300 bg-opacity-50">
                <th className="px-8 py-2">Order ID</th>
                <th className="px-8 py-2">Order date</th>
                <th className="px-8 py-2">Supplier</th>
                <th className="px-8 py-2">Product</th>
                <th className="px-8 py-2">Quantity</th>
                <th className="px-8 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.ORDER_ID}>
                  <td className="px-8 py-2">{order.ORDER_ID}</td>
                  <td className="px-8 py-2">{order.ORDER_DATE}</td>
                  <td className="px-8 py-2">{supplierNames[order.ORDER_ID]}</td>
                  <td className="px-8 py-2">{order.PRODUCT_NAME}</td>
                  <td className="px-8 py-2">{order.QUANTITY}</td>
                  <td className="px-8 py-2">{order.PRICE}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    )
}

export default OrderList