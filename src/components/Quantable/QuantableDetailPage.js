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

    const fetchQuantable = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/quantables/detail/${quantableId}/`);
            setQuantable(response.data);
        } catch (error) {
            console.error("Error fetching quantable details:", error);
            setErrorMessage('Error fetching quantable details.');
        }
    }, [quantableId]);

    useEffect(() => {
        fetchQuantable();
    }, [fetchQuantable]);

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