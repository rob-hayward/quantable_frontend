// src/components/Quantable/QuantablePairDetailPage.js

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import DensityPlotPair from '../Visualization/DensityPlotPair';
import './QuantablePairDetailPage.css';

const QuantablePairDetailPage = () => {
  const { pairId } = useParams();
  const [quantablePair, setQuantablePair] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [units, setUnits] = useState([]);
  const [minVote, setMinVote] = useState(null);
  const [maxVote, setMaxVote] = useState(null);
  const [newMinVoteValue, setNewMinVoteValue] = useState('');
  const [newMaxVoteValue, setNewMaxVoteValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuantablePair = useCallback(async (unit) => {
    try {
      const response = await axiosInstance.get(`/quantable-pairs/${pairId}/?preferred_unit=${unit}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch quantable pair");
      }
      setQuantablePair(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching quantable pair details:", error);
      setErrorMessage('Error fetching quantable pair details.');
      throw error;
    }
  }, [pairId]);

  const fetchUnits = useCallback(async (category) => {
    try {
      const response = await axiosInstance.get(`/units/${category}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching units:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching quantable pair...");
        const fetchedQuantablePair = await fetchQuantablePair(selectedUnit);
        console.log("Fetched quantable pair:", fetchedQuantablePair);
        if (fetchedQuantablePair) {
          setQuantablePair(fetchedQuantablePair);
          const minUserVote = fetchedQuantablePair.min_quantable.user_vote;
          const maxUserVote = fetchedQuantablePair.max_quantable.user_vote;
          setMinVote(minUserVote !== null ? parseFloat(minUserVote) : null);
          setMaxVote(maxUserVote !== null ? parseFloat(maxUserVote) : null);
          setNewMinVoteValue(minUserVote !== null ? minUserVote : '');
          setNewMaxVoteValue(maxUserVote !== null ? maxUserVote : '');

          const fetchedUnits = await fetchUnits(fetchedQuantablePair.min_quantable.category);
          const filteredUnits = [
            fetchedQuantablePair.min_quantable.default_unit,
            ...fetchedQuantablePair.min_quantable.available_units.filter(
              (unit) => fetchedUnits.some((fetchedUnit) => fetchedUnit.value === unit)
            ),
          ];
          setUnits(filteredUnits.map((unit) => ({ value: unit, name: unit })));
          setSelectedUnit(fetchedQuantablePair.min_quantable.preferred_unit || fetchedQuantablePair.min_quantable.default_unit);
        }
      } catch (error) {
        console.error("Error fetching quantable pair:", error);
        setError("Failed to fetch quantable pair.");
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedUnit, fetchQuantablePair, fetchUnits]);

  useEffect(() => {
    const updatePreferredUnit = async () => {
      try {
        await axiosInstance.patch(`/preferences/update/`, {
          quantable_id: quantablePair.min_quantable.id,
          preferred_unit: selectedUnit,
        });
        await axiosInstance.patch(`/preferences/update/`, {
          quantable_id: quantablePair.max_quantable.id,
          preferred_unit: selectedUnit,
        });
        console.log("Preferred unit updated:", selectedUnit);
      } catch (error) {
        console.error("Error updating unit preference:", error);
      }
    };

    if (quantablePair) {
      updatePreferredUnit();
    }
  }, [selectedUnit, quantablePair]);

  const handleUnitChange = async (e) => {
    const newUnit = e.target.value;
    setSelectedUnit(newUnit);

    try {
      await axiosInstance.patch(`/preferences/update/`, {
        quantable_id: quantablePair.min_quantable.id,
        preferred_unit: newUnit,
      });
      await axiosInstance.patch(`/preferences/update/`, {
        quantable_id: quantablePair.max_quantable.id,
        preferred_unit: newUnit,
      });
      await fetchQuantablePair(newUnit); // Call fetchQuantablePair with the updated selectedUnit
    } catch (error) {
      console.error("Error updating unit preference:", error);
    }
  };

  const handleMinVoteChange = (e) => {
    setNewMinVoteValue(e.target.value);
  };

  const handleMaxVoteChange = (e) => {
    setNewMaxVoteValue(e.target.value);
  };

  const handleMinVoteSubmit = async (e) => {
    e.preventDefault();
    const parsedValue = parseFloat(newMinVoteValue);
    if (isNaN(parsedValue)) {
      alert("Invalid vote value. Please enter a valid number.");
      return;
    }

    try {
      if (minVote && minVote.id) {
        await axiosInstance.patch(`/votes/detail/${minVote.id}/`, {
          value: parsedValue,
          preferred_unit: selectedUnit,
        });
        setMinVote(parsedValue); // Update minVote state immediately
      } else {
        await axiosInstance.post(`/votes/create/`, {
          quantable: quantablePair.min_quantable.id,
          value: parsedValue,
          preferred_unit: selectedUnit,
        });
        setMinVote(parsedValue); // Update minVote state immediately
      }
      await fetchQuantablePair(selectedUnit);
      setNewMinVoteValue('');
    } catch (error) {
      console.error("Error fetching quantable pair details:", error);
      setErrorMessage('Failed to submit/update min vote. Please try again.');
    }
  };

  const handleMaxVoteSubmit = async (e) => {
    e.preventDefault();
    const parsedValue = parseFloat(newMaxVoteValue);
    if (isNaN(parsedValue)) {
      alert("Invalid vote value. Please enter a valid number.");
      return;
    }

    try {
      if (maxVote && maxVote.id) {
        await axiosInstance.patch(`/votes/detail/${maxVote.id}/`, {
          value: parsedValue,
          preferred_unit: selectedUnit,
        });
        setMaxVote(parsedValue); // Update maxVote state immediately
      } else {
        await axiosInstance.post(`/votes/create/`, {
          quantable: quantablePair.max_quantable.id,
          value: parsedValue,
          preferred_unit: selectedUnit,
        });
        setMaxVote(parsedValue); // Update maxVote state immediately
      }
      await fetchQuantablePair(selectedUnit);
      setNewMaxVoteValue('');
    } catch (error) {
      console.error("Error submitting/updating max vote:", error.response.data);
      setErrorMessage('Failed to submit/update max vote. Please try again.');
    }
  };

  // Render loading state or error message
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="page-title">Quantable Pair Detail Page</h2>
      <div className="quantable-pair-detail-container">
        {quantablePair && (
          <div className="quantable-pair-header">
            <p>Created by: {quantablePair.min_quantable.creator_name}</p>
          </div>
        )}

        <div className="quantable-pair-detail-content">
          <div className="quantable-pair-info">
            {quantablePair && (
              <>
                <div className="min-question-section">
                  <h4>Minimum Question: {quantablePair.min_quantable.question}</h4>
                  <div className="vote-data">
                    <p>Total Min Votes: {quantablePair.min_quantable.vote_count}</p>
                    <p>Your Current Min Vote: {minVote !== null ? minVote : 'N/A'} {selectedUnit}</p>
                  </div>
                  <div className="new-vote-container">
                    <form onSubmit={handleMinVoteSubmit} className="new-vote-form">
                      <input
                        type="number"
                        value={newMinVoteValue}
                        onChange={handleMinVoteChange}
                        placeholder="Enter your min value"
                        required
                      />
                      <button className="button vote" type="submit">
                        {minVote ? 'Update Vote' : 'Submit Vote'}
                      </button>
                    </form>
                  </div>
                </div>

                <div className="max-question-section">
                  <h4>Maximum Question: {quantablePair.max_quantable.question}</h4>
                  <div className="vote-data">
                    <p>Total Max Votes: {quantablePair.max_quantable.vote_count}</p>
                    <p>Your Current Max Vote: {maxVote !== null ? maxVote : 'N/A'} {selectedUnit}</p>
                  </div>
                  <div className="new-vote-container">
                    <form onSubmit={handleMaxVoteSubmit} className="new-vote-form">
                      <input
                        type="number"
                        value={newMaxVoteValue}
                        onChange={handleMaxVoteChange}
                        placeholder="Enter your max value"
                        required
                      />
                      <button className="button vote" type="submit">
                        {maxVote ? 'Update Vote' : 'Submit Vote'}
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}

            {quantablePair && (
              <div className="unit-selector">
                <label htmlFor="unit">Select Unit:</label>
                <select id="unit" value={selectedUnit} onChange={handleUnitChange}>
                  {units.map((unit, index) => (
                    <option key={`${unit.value}-${index}`} value={unit.value}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          {quantablePair && (
            <div className="density-plot-container">
              <DensityPlotPair
                minData={quantablePair.min_quantable.freedman_diaconis_bins}
                maxData={quantablePair.max_quantable.freedman_diaconis_bins}
                minMean={quantablePair.min_quantable.vote_average}
                maxMean={quantablePair.max_quantable.vote_average}
                minStdDev={quantablePair.min_quantable.vote_stddev}
                maxStdDev={quantablePair.max_quantable.vote_stddev}
                xLabel={`${quantablePair.min_quantable.category} (${selectedUnit})`}
                yLabel="Probability Density"
                minUserVote={minVote}
                maxUserVote={maxVote}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantablePairDetailPage;