import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import swal from 'sweetalert';

const AddProductModal = ({ show, handleClose }) => {
  const [tital, setTital] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // State to store the CSRF token

  // Fetch the CSRF token when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:5004/api/csrf-token', { withCredentials: true }) // Make sure to include credentials if using cookies
      .then((response) => {
        setCsrfToken(response.data.csrfToken); // Set the CSRF token in state
      })
      .catch((err) => {
        console.error('Error fetching CSRF token:', err);
      });

    /*const sellerInfo = JSON.parse(localStorage.getItem('userInfo'));
    const getSellerId = sellerInfo['_id'];
    setSellerId(getSellerId);*/
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      image,
      tital,
      price,
      quantity,
      description,
      sellerId,
    };
    console.log('Checking new product details: ', newProduct);

    axios
      .post('http://localhost:5004/api/products', newProduct, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // Include the CSRF token in the request headers
        },
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then(() => {
        swal('Product Added!', 'Product Added Successfully!', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        swal('Error!', 'Error in Adding Product!', 'error');
        console.error('Error adding product:', err);
      });

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Product</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className='form-group'>
          <label htmlFor='ProductName'>Product Name</label>
          <input
            id='name'
            type='text'
            className='form-control'
            placeholder='Enter product Name'
            value={tital}
            onChange={(e) => {
              setTital(e.target.value);
            }}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='description'>Product Description</label>
          <input
            type='text'
            className='form-control'
            placeholder='Enter product Description'
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='quantity'>Quantity</label>
          <input
            type='number'
            className='form-control'
            placeholder='Enter Quantity'
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='price'>Price</label>
          <input
            type='number'
            className='form-control'
            placeholder='Price'
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='image'>Image</label>
          <input
            type='text'
            className='form-control'
            placeholder='Image URL'
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type='submit'
          className='btn btn-success'
          onClick={handleSubmit}
        >
          Add Product
        </button>
        <button className='btn btn-danger' onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProductModal;
