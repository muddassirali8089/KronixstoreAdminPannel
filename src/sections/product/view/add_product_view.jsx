/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Link } from '@mui/material';

import { Iconify } from '../../../components/iconify';

const AddProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    mrp: '',
    category: '',
    qty: '',
    min_qty: '',
    images: [],
    gender: '',
    description: '',
    status: true,
    variations: [],
    sizes: [],
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams(); // gets /products/edit/:id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.kronixstore.com/api/categories');
        setCategories(response.data);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // If editing, fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
  
      try {
        const response = await axios.get(`https://api.kronixstore.com/api/items/id/${id}`);
        const existing = response.data;
  
        // Ensure all fields are normalized before setting state
        setProduct({
          ...existing,
          images: Array.isArray(existing.images)
            ? existing.images
            : typeof existing.images === 'string'
            ? (() => {
                try {
                  return JSON.parse(existing.images);
                } catch {
                  return [];
                }
              })()
            : [],
  
          sizes: Array.isArray(existing.sizes)
            ? existing.sizes
            : typeof existing.sizes === 'string'
            ? existing.sizes.split(',').map((s) => s.trim().toLowerCase())
            : [],
  
          variations: Array.isArray(existing.variations)
            ? existing.variations
            : typeof existing.variations === 'string'
            ? (() => {
                try {
                  return JSON.parse(existing.variations);
                } catch {
                  return [];
                }
              })()
            : [],
        });
        
      } catch (err) {
        console.error(err);
        setError('Failed to load product');
      }
    };
  
    fetchProduct();
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };
  const handleRemoveImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  const handleStatusToggle = () => {
    setProduct((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }));

    Promise.all(readers).then((base64Images) => {
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images],
      }));

    }).catch((err) => console.error("Image reading failed", err));
  };


  const handleAddVariation = () => {
    setProduct((prev) => ({
      ...prev,
      variations: [...prev.variations, { color: '', color_code: '', image: '' }],
    }));
  };

  const handleVariationChange = (index, field, value) => {
    const newVariations = [...product.variations];
    newVariations[index][field] = value;
    setProduct((prev) => ({ ...prev, variations: newVariations }));
  };

  const handleVariationImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newVariations = [...product.variations];
      newVariations[index].image = reader.result;
      setProduct((prev) => ({ ...prev, variations: newVariations }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.name || !product.price || !product.category) {
      alert('Please fill all required fields');
      return;
    }

    try {
      if (id) {
        // Update existing
        await axios.put(`https://api.kronixstore.com/api/items/${id}`, product);
        alert('Item updated!');
      } else {
        // Create new
        const response = await axios.post('https://api.kronixstore.com/api/items', product);


        if (response.data.message === 'iae') {
          alert('Item already exists');
          return;
        }

        alert('Item added successfully!');
      }

      navigate('/products');
    // eslint-disable-next-line no-shadow
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Something went wrong');
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className='flex items-center justify-between mb-4'>
        <Link href="/products"><Iconify icon="mdi:arrow-left-bold" className='w-10 h-10 cursor-pointer' /></Link>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {id ? 'Edit Product' : 'Add Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md" />

        <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md" />

        <input type="number" name="mrp" placeholder="MRP" value={product.mrp} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md" />

        <select name="category" value={product.category} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md">
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select name="gender" value={product.gender} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-md">
          <option value="">Select Gender</option>
          <option value='Male'>Male</option>
          <option value='Female'>Female</option>
        </select>

        <input type="number" name="qty" placeholder="Quantity" value={product.qty} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />
        <input type="number" name="min_qty" placeholder="Min. Quantity to be purchased" value={product.min_qty} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" />

        <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} rows="4" className="w-full p-3 border border-gray-300 rounded-md" />

        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">Upload Main Image</label>
          <input
            id="image-upload"
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {product.images.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-4">
              {product.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt={`preview-${i}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5"
                  >
                    ✕
                  </button>
                </div>
              ))}

            </div>
          )}
        </div>

        <input
          type="text"
          name="sizes"
          placeholder="Sizes (comma separated, e.g., S,M,L)"
          value={Array.isArray(product.sizes) ? product.sizes.join(',') : ''}
          onChange={(e) =>
            setProduct((prev) => ({
              ...prev,
              sizes: e.target.value.split(',').map((s) => s.trim().toLowerCase()),
            }))
          }
          className="w-full p-3 border border-gray-300 rounded-md"
        />

        {/* Variations Section */}
        <div className="space-y-4">
          <label className="font-semibold block">Variations</label>
          {product.variations.map((variation, index) => (
            <div key={index} className="border p-3 rounded space-y-2 bg-gray-50">
              <input type="text" placeholder="Color Name" value={variation.color} onChange={(e) => handleVariationChange(index, 'color', e.target.value)} className="w-full p-2 border rounded" />
              <input type="text" placeholder="Color Code (#FF0000)" value={variation.color_code} onChange={(e) => handleVariationChange(index, 'color_code', e.target.value)} className="w-full p-2 border rounded" />
              <input type="file" accept="image/*" onChange={(e) => handleVariationImageChange(index, e.target.files[0])} className="w-full" />
              {variation.image && variation.image.startsWith('data') && (
                <img src={variation.image} alt="Variation" className="w-20 h-20 object-cover rounded border" />
              )}
            </div>
          ))}

          <button type="button" onClick={handleAddVariation} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            + Add Variation
          </button>
        </div>

        {/* Status Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <div className='flex items-center gap-2.5'>
            <div className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${product.status ? 'bg-green-500' : 'bg-gray-300'}`} role="button" tabIndex="0" onClick={handleStatusToggle} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleStatusToggle(); }}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${product.status ? 'translate-x-6' : ''}`} />
            </div>
            <span className="text-sm text-gray-500">{product.status ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition">
          {id ? 'Update Product' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
