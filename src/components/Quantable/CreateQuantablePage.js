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

  const [selectedCategoryPair, setSelectedCategoryPair] = useState('');
  const [selectedDefaultUnitPair, setSelectedDefaultUnitPair] = useState('');
  const [selectedUnitsPair, setSelectedUnitsPair] = useState([]);
  const [questionContentMinPair, setQuestionContentMinPair] = useState('');
  const [questionContentMaxPair, setQuestionContentMaxPair] = useState('');

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

  const handleCategoryChangePair = async (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategoryPair(selectedCategory);

    try {
      const response = await axiosInstance.get(`/units/${selectedCategory}/`);
      setUnits(response.data);
      setSelectedDefaultUnitPair('');
      setSelectedUnitsPair([]);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleDefaultUnitChangePair = (event) => {
    const defaultUnit = event.target.value;
    setSelectedDefaultUnitPair(defaultUnit);
    setSelectedUnitsPair(selectedUnitsPair.filter((unit) => unit !== defaultUnit));
  };

  const handleUnitChangePair = (event) => {
    const unit = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedUnitsPair([...selectedUnitsPair, unit]);
    } else {
      setSelectedUnitsPair(selectedUnitsPair.filter((selectedUnit) => selectedUnit !== unit));
    }
  };

  const handleSubmitPair = async (event) => {
  event.preventDefault();

  try {
    const pairId = Date.now().toString(); // Generate a unique pair ID

      const minRequestData = {
        category: selectedCategoryPair,
        available_units: [...selectedUnitsPair, selectedDefaultUnitPair],
        default_unit: selectedDefaultUnitPair,
        question: questionContentMinPair,
        pair_id: pairId,
        is_min: true,
      };

      const maxRequestData = {
        category: selectedCategoryPair,
        available_units: [...selectedUnitsPair, selectedDefaultUnitPair],
        default_unit: selectedDefaultUnitPair,
        question: questionContentMaxPair,
        pair_id: pairId,
        is_min: false,
      };

       const response = await axiosInstance.post('/quantables/create/', {
        pair_id: pairId,
        min_quantable: minRequestData,
        max_quantable: maxRequestData,
      });

      console.log("Response data:", response.data);  // Add this line

      if (response.status === 201) {
        const createdPairId = response.data.pair_id; // Extract the pair_id from the response data
          console.log("Navigating to:", `/quantable-pairs/${createdPairId}`);
          navigate(`/quantable-pairs/${createdPairId}`);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage('Error: ' + error.message);
    }
  };

      const availableUnits = units.filter((unit) => unit.value !== selectedDefaultUnit);
      const availableUnitsPair = units.filter((unit) => unit.value !== selectedDefaultUnitPair);

  return (
    <div className="create-quantable-container">
      <h2 className="create-quantable-heading">Create a New Quantable</h2>

      <h3>Create Single Quantable</h3>
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
          <select
            id="default-unit"
            className="create-quantable-default-unit"
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

      <h3>Create Quantable Pair</h3>
      <form onSubmit={handleSubmitPair} className="create-quantable-form">
        <select
          className="create-quantable-select"
          id="categoryPair"
          value={selectedCategoryPair}
          onChange={handleCategoryChangePair}
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
          <select
            id="default-unit-pair"
            className="create-quantable-default-unit"
            value={selectedDefaultUnitPair}
            onChange={handleDefaultUnitChangePair}
            required
            disabled={!selectedCategoryPair}
          >
            <option value="">Select a default unit</option>
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
        {selectedDefaultUnitPair && (
          <div>
            <p className="alternative-units-hint">Please select any alternative unit options:</p>
            <div className="alternative-units-list">
              {availableUnitsPair.map((unit) => (
                <div key={unit.value}>
                  <input
                    type="checkbox"
                    id={`unit-pair-${unit.value}`}
                    value={unit.value}
                    checked={selectedUnitsPair.includes(unit.value)}
                    onChange={handleUnitChangePair}
                  />
                  <label htmlFor={`unit-pair-${unit.value}`}>{unit.name}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        <textarea
          className="create-quantable-textarea"
          id="questionContentMinPair"
          placeholder="Minimum Question"
          value={questionContentMinPair}
          onChange={(e) => setQuestionContentMinPair(e.target.value)}
          required
        ></textarea>
        <textarea
          className="create-quantable-textarea"
          id="questionContentMaxPair"
          placeholder="Maximum Question"
          value={questionContentMaxPair}
          onChange={(e) => setQuestionContentMaxPair(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="create-quantable-submit-button">
          Create Quantable Pair
        </button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default CreateQuantablePage;