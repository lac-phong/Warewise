import React, { useState, useEffect } from 'react';
import Axios from 'axios';

function OrderList(props) {
  const [orders, setOrders] = useState([]);
  const [supplierId, setSupplierId] = useState([])
  const [supplierNames, setSupplierNames] = useState({});
  

    const fetchOrders = async () => {
        try {
        const response = await Axios.get('http://localhost:8080/orders', { withCredentials: true });
        setOrders(response.data);
        } catch (error) {
        console.error('Error fetching order data:', error);
        }
    };

    const fetchSupplier = async () => {
        try {
            const response = await Axios.get('http://localhost:8080/supplier', {order_id: orders.ORDER_ID}, { withCredentials: true })
            setSupplierId(response.SUPPLIER_ID)
        } catch (error) {
            console.error('Error fetching supplier ID:', error)
        }
    }

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
        const fetchSupplierData = async () => {
        const supplierNamesMap = {};
        for (const order of orders) {
            const supplierId = await fetchSupplier(order.ORDER_ID);
            if (supplierId) {
            const supplierName = await fetchSupplierName(supplierId);
            supplierNamesMap[order.ORDER_ID] = supplierName;
            }
        }
        setSupplierNames(supplierNamesMap);
        };
        fetchSupplierData();
    }, [orders]);

    return (
        <div className="min-w-full overflow-y-auto">
          <table className="table-auto border-collapse ">
            <thead>
              <tr className="bg-blue-300 bg-opacity-50">
                <th className="px-8 py-2">Order ID</th>
                <th className="px-8 py-2">Order date</th>
                <th className="px-8 py-2">Supplier</th>
                <th className="px-8 py-2">Product</th>
                <th className="px-8 py-2">Product Category</th>
                <th className="px-8 py-2">Description</th>
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