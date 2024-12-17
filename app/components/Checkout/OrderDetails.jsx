import React, { useState, useEffect } from 'react';

import DeliveryInformation from './DeliveryInformation';


import ShippingDetails from './ShippingDetails';
import { useLoaderData } from '@remix-run/react';

const sharedClasses = {
    textZinc: 'text-zinc-600 dark:text-zinc-400',
    textBoldZinc: 'text-lg font-bold text-zinc-900 dark:text-zinc-100',
    borderZinc: 'border rounded-md border-zinc-300 dark:border-zinc-600',
    button: 'w-full bg-black text-white p-2 rounded-lg hover:bg-zinc-800',
};

const initialShops = [
    { name: 'Shop 1', lat: 18.2591827, lng: 76.1773209, product: 'Product 1', productID: 'P001' },
    { name: 'Shop 2', lat: 18.563636, lng: 76.214588, product: 'Product 2', productID: 'P002' },
    { name: 'Shop 3', lat: 18.409984, lng: 76.577656, product: 'Product 3', productID: 'P003' },
    { name: 'Shop 4', lat: 18.270430, lng: 76.256743, product: 'Product 4', productID: 'P004' },
    { name: 'Shop 5', lat: 18.380173, lng: 76.731065, product: 'Product 1', productID: 'P001' },
    { name: 'Shop 6', lat: 17.885044, lng: 76.586671, product: 'Product 2', productID: 'P002' },
    { name: 'Shop 7', lat: 18.545800, lng: 76.288155, product: 'Product 3', productID: 'P003' },
    { name: 'Shop 8', lat: 18.034805, lng: 76.425833, product: 'Product 4', productID: 'P004' },
    { name: 'Shop 9', lat: 18.318330, lng: 76.478090, product: 'Product 1', productID: 'P001' },
    { name: 'Shop 10', lat: 18.599326, lng: 76.623996, product: 'Product 2', productID: 'P002' },
  ];

const OrderDetails = () => {
   const {shippingAddress}=useLoaderData();
  

   

   

   
   

    return (
        <div className="p-6 bg-white dark:bg-background rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                When would you like to get your order?
            </h2>
            <div className={sharedClasses.borderZinc}>
                <p className="p-4 text-zinc-700 dark:text-zinc-300">Arrives {new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
           <ShippingDetails/>

           
           
            <DeliveryInformation shippingAddress={shippingAddress}/>
            <div className="mt-6 border-t border-zinc-300 dark:border-zinc-600 pt-4">
                <h4 className="text-md font-bold text-zinc-800 dark:text-zinc-200">Shipping</h4>
                <p className={sharedClasses.textZinc}>Your shipping information goes here.</p>
            </div>
            <div className="mt-6 border-t border-zinc-300 dark:border-zinc-600 pt-4">
                <h4 className="text-md font-bold text-zinc-800 dark:text-zinc-200">Billing</h4>
            </div>
            <div className="mt-6 border-t border-zinc-300 dark:border-zinc-600 pt-4">
                <h4 className="text-md font-bold text-zinc-800 dark:text-zinc-200">Payment</h4>
            </div>
          
        </div>
    );
};

export default OrderDetails;
