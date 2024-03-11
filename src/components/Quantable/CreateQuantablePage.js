// src/components/Quantable/CreateQuantablePage.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './CreateQuantablePage.css';

const CreateQuantablePage = () => {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

const fetchCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories/');
    setCategories(response.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const handleCategoryChange = async (event) => {
  const selectedCategory = event.target.value;
  setSelectedCategory(selectedCategory);

  try {
    const response = await axiosInstance.get(`/units/${selectedCategory}/`);
    setUnits(response.data);
    setSelectedUnit('');
  } catch (error) {
    console.error('Error fetching units:', error);
  }
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const requestData = {
        category: selectedCategory,
        unit: selectedUnit,
        question: questionContent,
      };

      const response = await axiosInstance.post('/quantables/create/', requestData);
      console.log('Response Data:', response.data);

      if (response.status === 201) {
        const quantableId = response.data.id;
        navigate(`/quantables/${quantableId}`);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="create-quantable-container">
      <h2 className="create-quantable-heading">Create a New Quantable</h2>
      <form onSubmit={handleSubmit} className="create-quantable-form">
        <select
            className="create-quantable-select"
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.name}
              </option>
          ))}
        </select>
        <select
            className="create-quantable-select"
            id="unit"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            required
            disabled={!selectedCategory}
        >
          <option value="">Select a unit</option>
          {units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.name}
              </option>
          ))}
        </select>
        <textarea
            className="create-quantable-textarea"
            id="questionContent"
            placeholder="Question"
            value={questionContent}
            onChange={(e) => setQuestionContent(e.target.value)}
            required
        ></textarea>
        <button type="submit" className="create-quantable-submit-button">
          Create Quantable
        </button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default CreateQuantablePage;