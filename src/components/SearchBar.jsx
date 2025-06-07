"use client";
import React, { useState, useEffect, useContext } from 'react';


export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    }

    return (
        <div className="w-full  max-w-lg mx-auto mb-6">
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search by title ..."
                className="w-full px-4 py-2 border rounded-lg shadow-sm  text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300"
            />

        </div>
    )

}