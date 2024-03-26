// src/components/Quantable/CreateQuantablePage.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './CreateQuantablePage.css';

const CreateQuantablePage = () => {
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDefaultUnit, setSelectedDefaultUnit] = useState('');
  const [selectedUnits, setSelectedUnits] = useState([]);
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
      setSelectedDefaultUnit('');
      setSelectedUnits([]);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleDefaultUnitChange = (event) => {
    const defaultUnit = event.target.value;
    setSelectedDefaultUnit(defaultUnit);
    setSelectedUnits(selectedUnits.filter((unit) => unit !== defaultUnit));
  };

  const handleUnitChange = (event) => {
    const unit = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedUnits([...selectedUnits, unit]);
    } else {
      setSelectedUnits(selectedUnits.filter((selectedUnit) => selectedUnit !== unit));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const requestData = {
        category: selectedCategory,
        available_units: [...selectedUnits, selectedDefaultUnit],
        default_unit: selectedDefaultUnit,
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

  const availableUnits = units.filter((unit) => unit.value !== selectedDefaultUnit);

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
        <div>
          {/*<label htmlFor="default-unit">Default Unit:</label>*/}
          <select
            id="default-unit"
            value={selectedDefaultUnit}
            onChange={handleDefaultUnitChange}
            required
            disabled={!selectedCategory}
          >
            <option value="">Select a default unit</option>
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
        {selectedDefaultUnit && (
          <div>
            <p className="alternative-units-hint">Please select any alternative unit options:</p>
            <div className="alternative-units-list">
              {availableUnits.map((unit) => (
                <div key={unit.value}>
                  <input
                    type="checkbox"
                    id={`unit-${unit.value}`}
                    value={unit.value}
                    checked={selectedUnits.includes(unit.value)}
                    onChange={handleUnitChange}
                  />
                  <label htmlFor={`unit-${unit.value}`}>{unit.name}</label>
                </div>
              ))}
            </div>
          </div>
        )}
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