import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
// import BellCurve from '../Visualization/BellCurve';
import './QuantableDetailPage.css';

const QuantableDetailPage = () => {
    const { quantableId } = useParams();
    const [quantable, setQuantable] = useState(null);
    const [votes, setVotes] = useState([]);
    const [newVoteValue, setNewVoteValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [units, setUnits] = useState([]); // Add units state

    const fetchQuantable = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/quantables/detail/${quantableId}/`);
            setQuantable(response.data);
            setSelectedUnit(response.data.unit); // Set the default selected unit
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
            const fetchedQuantable = await fetchQuantable();
            if (fetchedQuantable) {
                const fetchedUnits = await fetchUnits(fetchedQuantable.category);
                setUnits(fetchedUnits); // Set the units state
            }
        };
        fetchData();
    }, [quantableId, fetchQuantable, fetchUnits]);

    const handleNewVoteChange = (e) => {
        setNewVoteValue(e.target.value);
    };

    const handleVoteSubmit = async (e) => {
        e.preventDefault();
        if (!newVoteValue.trim()) {
            alert("Vote value cannot be empty.");
            return;
        }
        try {
            const response = await axiosInstance.post(`/votes/create/`, {
                quantable: quantableId,
                value: newVoteValue,
                preferred_unit: selectedUnit, // Include the selected unit in the request data
            });
            setVotes([...votes, response.data]);
            setNewVoteValue('');
            fetchQuantable();
        } catch (error) {
            console.error("Error submitting vote:", error.response.data);
            setErrorMessage('Failed to submit vote. Please try again.');
        }
    };

    return (
    <div>
        <h2 className="page-title">Quantable Detail Page</h2>
        <div className="quantable-detail-container">
            {quantable && (
                <div className="quantable-content">
                    <h4>Category: {quantable.category}</h4>
                    <h4>Question: {quantable.question}</h4>
                    <p>Created by: {quantable.creator}</p>
                    <p>Total Votes: {quantable.vote_count}</p>
                    <p>Average Vote: {quantable.vote_average}</p>
                    {quantable.vote_values && (
                        <ul>
                            {quantable.vote_values.map((vote, index) => (
                                <li key={index}>{vote}</li>
                            ))}
                        </ul>
                    )}
                </div>
                )}

                {quantable && (
                    <div className="unit-selector">
                        <label htmlFor="unit">Select Unit:</label>
                        <select
                            id="unit"
                            value={selectedUnit}
                            onChange={(e) => setSelectedUnit(e.target.value)}
                        >
                            {units.map((unit) => (
                                <option key={unit.value} value={unit.value}>
                                    {unit.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {quantable && (
                    <div className="bell-curve-container">
                        {/*<BellCurve data={quantable.vote_data_for_d3} />*/}
                    </div>
                )}
            </div>

            <div className="new-vote-container">
                <form onSubmit={handleVoteSubmit} className="new-vote-form">
                    <input
                        type="number"
                        value={newVoteValue}
                        onChange={handleNewVoteChange}
                        placeholder="Enter your vote value"
                        required
                    />
                    <button className="button vote" type="submit">Submit Vote</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default QuantableDetailPage;