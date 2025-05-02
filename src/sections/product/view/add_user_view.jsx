/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios';
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Link } from '@mui/material';

import { Iconify } from '../../../components/iconify';

const AddUser = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    email: '',
    mobile: '',
    image: '',
    status: true, // true = Active, false = Inactive
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusToggle = () => {
    setProduct((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!product.name || !product.email || !product.mobile) {
      alert('Please fill all required fields');
      return;
    }
    const response = axios.post('https://api.kronixstore.com/api/users', product);
    navigate('/user');
    console.log('User Added:', product);
    alert('User added successfully!');

    // Reset form
    setProduct({
      name: '',
      email: '',
      mobile: '',
      image: '',
      status: true,
    });
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-4'>
        <Link href="/user"><Iconify icon="mdi:arrow-left-bold" className='w-10 h-10 cursor-pointer' /></Link>
        <h2 className="text-2xl font-semibold mb-4 text-center">Add User</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="User Name"
          value={product.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={product.price}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />

        <input
          type="number"
          name="mobile"
          placeholder="Mobile Number"
          value={product.category}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />


        {/* <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <input
            id="image-upload"
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) =>
              setProduct((prev) => ({
                ...prev,
                image: e.target.files[0],
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            aria-labelledby="image-upload"
          />

          {product.image && typeof product.image === 'object' && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">Preview:</p>
              <img
                src={URL.createObjectURL(product.image)}
                alt="preview"
                className="mt-1 w-32 h-32 object-cover rounded border"
              />
            </div>
          )}
        </div> */}



        {/* Toggle Switch */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status</span>

          <div className='flex items-center gap-2.5'>
            <div
              className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${product.status ? 'bg-green-500' : 'bg-gray-300'
                }`}
              role="button"
              tabIndex="0"
              onClick={handleStatusToggle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleStatusToggle();
                }
              }}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${product.status ? 'translate-x-6' : ''
                  }`}
              />
            </div>
            <span className="text-sm text-gray-500">
              {product.status ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
