// src/components/Quantable/QuantableListPage.js

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import DensityPlot from '../Visualization/DensityPlot';
import './QuantableListPage.css';

const QuantableListPage = () => {
    const [quantables, setQuantables] = useState([]);
    const [sort, setSort] = useState('newest');

    // Fetch quantables with selected sorting
    const fetchQuantables = (sortOption = 'newest') => {
        axiosInstance.get(`/quantables/list/?sort=${sortOption}`)
            .then(response => {
                setQuantables(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the quantables', error);
            });
    };

    useEffect(() => {
        fetchQuantables(sort);
    }, [sort]);

    const handleSortChange = (e) => {
        setSort(e.target.value);
        fetchQuantables(e.target.value);
    };

    return (
        <div className="quantable-list-container">
            <h2 className="page-title-l">Quantable List Page</h2>
            <div className="sort-selector">
                <label htmlFor="sort">Sort quantables by:</label>
                <select id="sort" onChange={handleSortChange} value={sort}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="total_votes">Total Votes</option>
                </select>
            </div>

            {quantables.map((quantable) => (
                <div key={quantable.id} className="quantable-item">
                    <div className="quantable-content">
                        <Link to={`/quantables/${quantable.id}`}>
                            <h3>Question: {quantable.question}</h3>
                        </Link>
                        <p>By: {quantable.creator_name}</p>
                        <Link to={`/quantables/${quantable.id}`} className="button">View Details</Link>
                    </div>
                    <div className="density-plot-container">
                        <DensityPlot
                            data={quantable.freedman_diaconis_bins}
                            mean={quantable.vote_average}
                            stdDev={quantable.vote_stddev}
                            xLabel={`${quantable.category} (${quantable.preferred_unit || quantable.default_unit})`}
                            yLabel="Probability Density"
                            userVote={quantable.user_vote !== null ? parseFloat(quantable.user_vote) : null}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuantableListPage;