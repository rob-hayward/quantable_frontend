// src/components/Quantable/QuantableListPage.js

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
// import BellCurve from '../Visualization/BellCurve';
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
            <h2 className="page-title">Quantable List Page</h2>
            <div className="sort-selector">
                <label htmlFor="sort">Sort quantables by:</label>
                <select id="sort" onChange={handleSortChange} value={sort}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popularity">Most Popular</option>
                    <option value="total_votes">Total Votes</option>
                </select>
            </div>
            {quantables.map((quantable) => (
                <div key={quantable.id} className="quantable">
                    <div className="quantable-content">
                        <p>Category: {quantable.category}</p>
                        <Link to={`/quantables/${quantable.id}`}>
                            <h3>Question: {quantable.question}</h3>
                        </Link>
                        <p>By: {quantable.creator}</p>
                        <Link to={`/quantables/${quantable.id}`} className="button">View Details</Link>
                    </div>
                    <div className="quantable-visualization">
                        {/*<BellCurve data={quantable.vote_data_for_d3} />*/}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuantableListPage;