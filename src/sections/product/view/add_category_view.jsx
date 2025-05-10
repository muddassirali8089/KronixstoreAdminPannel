import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Link } from '@mui/material';

import { Iconify } from '../../../components/iconify';

const AddCategoryForm = () => {
  const [category, setCategory] = useState({
    name: '',
    status: true,
  });

  const { id } = useParams(); // gets /categories/edit/:id
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing category if editing
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return; // If no id in URL, skip

      try {
        const response = await axios.get(`http://localhost:3030/api/categories/id/${id}`);
        console.log(response.data);
        
        setCategory(response.data); // Assuming response contains category data
      } catch (err) {
        setError('Failed to load category');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle the status
  const handleStatusToggle = () => {
    setCategory((prev) => ({ ...prev, status: !prev.status }));
  };

  // Handle form submission (Add/Edit category)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category.name) {
      alert('Please enter a category name');
      return;
    }

    try {
      if (id) {
        // Update existing category
        await axios.put(`http://localhost:3030/api/categories/${id}`, category);
        alert('Category updated!');
      } else {
        // Create new category
        await axios.post('http://localhost:3030/api/categories', category);
        alert('Category added successfully!');
      }

      navigate('/category'); // Redirect after successful action
    // eslint-disable-next-line no-shadow
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Something went wrong');
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-4'>
        <Link href="/category"><Iconify icon="mdi:arrow-left-bold" className='w-10 h-10 cursor-pointer' /></Link>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {id ? 'Edit Category' : 'Add Category'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={category.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />

        {/* Status Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <div className='flex items-center gap-2.5'>
            <div
              className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${category.status ? 'bg-green-500' : 'bg-gray-300'}`}
              role="button"
              tabIndex="0"
              onClick={handleStatusToggle}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleStatusToggle(); }}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${category.status ? 'translate-x-6' : ''}`}
              />
            </div>
            <span className="text-sm text-gray-500">{category.status ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition"
        >
          {id ? 'Update Category' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryForm;
