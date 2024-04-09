// src/components/Quantable/QuantableListPage.js

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import DensityPlot from '../Visualization/DensityPlot';
import DensityPlotPair from '../Visualization/DensityPlotPair';
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
                <div key={quantable.pair_id || quantable.id} className="quantable-item">
                    {quantable.type === 'pair' ? (
                        <div className="quantable-pair-content">
                            <Link to={`/quantable-pairs/${quantable.pair_id}`}>
                                <h3>Minimum Question: {quantable.min_quantable.question}</h3>
                                <h3>Maximum Question: {quantable.max_quantable.question}</h3>
                            </Link>
                            <p>By: {quantable.min_quantable.creator_name}</p>
                            <Link to={`/quantable-pairs/${quantable.pair_id}`} className="button">View Pair Details</Link>
                            <div className="density-plot-pair-container">
                                <DensityPlotPair
                                    minData={quantable.min_quantable.freedman_diaconis_bins}
                                    maxData={quantable.max_quantable.freedman_diaconis_bins}
                                    minMean={quantable.min_quantable.vote_average}
                                    maxMean={quantable.max_quantable.vote_average}
                                    minStdDev={quantable.min_quantable.vote_stddev}
                                    maxStdDev={quantable.max_quantable.vote_stddev}
                                    xLabel={`${quantable.min_quantable.category} (${quantable.min_quantable.preferred_unit || quantable.min_quantable.default_unit})`}
                                    yLabel="Probability Density"
                                    minUserVote={quantable.min_quantable.user_vote !== null ? parseFloat(quantable.min_quantable.user_vote) : null}
                                    maxUserVote={quantable.max_quantable.user_vote !== null ? parseFloat(quantable.max_quantable.user_vote) : null}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="quantable-content">
                            <Link to={`/quantables/${quantable.id}`}>
                                <h3>Question: {quantable.question}</h3>
                            </Link>
                            <p>By: {quantable.creator_name}</p>
                            <Link to={`/quantables/${quantable.id}`} className="button">View Details</Link>
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
                    )}
                </div>
            ))}
        </div>
    );
};

export default QuantableListPage;