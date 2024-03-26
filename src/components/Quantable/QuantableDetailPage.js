// src/components/Quantable/QuantableDetailPage.js

import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import DensityPlot from '../Visualization/DensityPlot';
import './QuantableDetailPage.css';

const QuantableDetailPage = () => {
    const { quantableId } = useParams();
    const [quantable, setQuantable] = useState(null);
    const [userVote, setUserVote] = useState(null);
    const [newVoteValue, setNewVoteValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [units, setUnits] = useState([]); // Add units state

    const fetchQuantable = useCallback(async (preferredUnit) => {
        try {
            const response = await axiosInstance.get(`/quantables/detail/${quantableId}/?preferred_unit=${preferredUnit}`);
            setQuantable(response.data);
            setSelectedUnit(response.data.preferred_unit || response.data.default_unit);
            return response.data; // Return the fetched quantable data
        } catch (error) {
            console.error("Error fetching quantable details:", error);
            setErrorMessage('Error fetching quantable details.');
            return null; // Return null in case of an error
        }
    }, [quantableId]);

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
            const fetchedQuantable = await fetchQuantable(selectedUnit);
            if (fetchedQuantable) {
                setQuantable(fetchedQuantable);
                // Check if the user has already voted on this quantable
                const userVote = fetchedQuantable.vote_values?.find(
                    (vote) => vote.user === fetchedQuantable.creator // Update this line
                );
                setUserVote(userVote);
                setNewVoteValue(userVote ? userVote.value : '');

                // Fetch units based on the quantable category
                const fetchedUnits = await fetchUnits(fetchedQuantable.category);
                console.log('Fetched units:', fetchedUnits);

                // Filter out units that are not the default_unit or not in available_units
                const filteredUnits = [
                    fetchedQuantable.default_unit,
                    ...fetchedQuantable.available_units.filter(
                        (unit) =>
                            fetchedUnits.some(
                                (fetchedUnit) => fetchedUnit.value === unit
                            )
                    ),
                ];
                console.log('Filtered units:', filteredUnits);

                // Set the units state with the filteredUnits array
                setUnits(filteredUnits.map((unit) => ({ value: unit, name: unit })));
            }
        };
        fetchData();
    }, [fetchQuantable, selectedUnit, fetchUnits]);


    const handleNewVoteChange = (e) => {
        setNewVoteValue(e.target.value);
    };

    const handleUnitChange = async (e) => {
        const newUnit = e.target.value;
        setSelectedUnit(newUnit);
        try {
            await axiosInstance.patch(`/preferences/update/`, {
                quantable_id: quantableId,
                preferred_unit: newUnit,
            });
            fetchQuantable(newUnit);
        } catch (error) {
            console.error("Error updating unit preference:", error);
        }
    };

    const handleVoteSubmit = async (e) => {
        e.preventDefault();
        if (typeof newVoteValue === 'undefined' || newVoteValue === null) {
            alert("Vote value cannot be empty.");
            return;
        }

        const trimmedValue = newVoteValue.trim();

        if (!trimmedValue) {
            alert("Vote value cannot be empty.");
            return;
        }

        const parsedValue = parseFloat(trimmedValue);

        if (isNaN(parsedValue)) {
            alert("Invalid vote value. Please enter a valid number.");
            return;
        }

        try {
            if (userVote && userVote.id) {
                // Update the existing vote
                await axiosInstance.patch(`/votes/detail/${userVote.id}/`, {
                    value: parsedValue,
                    preferred_unit: selectedUnit,
                });
            } else {
                // Create a new vote
                await axiosInstance.post(`/votes/create/`, {
                    quantable: quantableId,
                    value: parsedValue,
                    preferred_unit: selectedUnit,
                });
            }
            fetchQuantable(selectedUnit);
            setNewVoteValue(''); // Clear the input box after a successful vote submission
        } catch (error) {
            console.error("Error submitting/updating vote:", error.response.data);
            setErrorMessage('Failed to submit/update vote. Please try again.');
        }
    };

       return (
        <div>
            <h2 className="page-title">Quantable Detail Page</h2>
            <div className="quantable-detail-container">
                {quantable && (
                    <div className="quantable-header">
                        <h4>Question: {quantable.question}</h4>
                        <p>Created by: {quantable.creator_name}</p>
                    </div>
                )}

                <div className="quantable-detail-content">
                    <div className="quantable-info">
                        <div className="voting-section">
                            {quantable && (
                                <div className="vote-data">
                                    <p>Total Votes: {quantable.vote_count}</p>
                                    <p>Your Current Vote: {quantable.user_vote !== null ? quantable.user_vote : 'N/A'} {selectedUnit}</p>
                                </div>
                            )}

                            {quantable && (
                                <div className="unit-selector">
                                    <label htmlFor="unit">Select Unit:</label>
                                    <select id="unit" value={selectedUnit} onChange={handleUnitChange}>
                                        {units.map((unit) => (
                                            <option key={unit.value} value={unit.value}>
                                                {unit.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="new-vote-container">
                                <form onSubmit={handleVoteSubmit} className="new-vote-form">
                                    <input
                                        type="number"
                                        value={newVoteValue}
                                        onChange={handleNewVoteChange}
                                        placeholder="Enter your vote value"
                                        required
                                    />
                                    <button className="button vote" type="submit">
                                        {userVote ? 'Update Vote' : 'Submit Vote'}
                                    </button>
                                </form>
                                {errorMessage && <p className="error-message">{errorMessage}</p>}
                            </div>

                            {quantable && quantable.ninety_percent_vote_range && (
                                <p>{quantable.ninety_percent_vote_range.statement}</p>
                            )}
                        </div>
                    </div>

                    {quantable && (
                        <div className="density-plot-container">
                            <DensityPlot
                                data={quantable.freedman_diaconis_bins}
                                mean={quantable.vote_average}
                                stdDev={quantable.vote_stddev}
                                xLabel={`${quantable.category} (${selectedUnit})`}
                                yLabel="Probability Density"
                                userVote={quantable.user_vote !== null ? parseFloat(quantable.user_vote) : null}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuantableDetailPage;