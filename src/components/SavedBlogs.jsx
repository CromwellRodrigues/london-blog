"use client";
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Card, CardDescription, CardTitle } from './ui/card';   
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationLink,
} from './ui/pagination';

import { FaHeart, FaRegHeart } from 'react-icons/fa';

import { SavedItemsContext } from '@/context/SavedItems';

import { client } from '@/sanity/lib/client';

import SearchBar from './SearchBar';
import Image from 'next/image';

export default function SavedBlogs({ isUserAuthenticated }) {

    const { savedItems, toggleSaveItem } = useContext(SavedItemsContext);
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');



    // Fetch saved blogs from Sanity based on savedItems
    useEffect(() => {
        async function fetchSavedBlogs() {
            if(savedItems && savedItems.length > 0) {
                const query = `
                *[_type =='post' && _id in ${JSON.stringify(savedItems)}]{
                    _id,
                    title, 
                    "slug": slug.current,
                    description,
                    "mainImageUrl": mainImage.asset->url,
                    imageURL,
                    author,
                    dateCreated,
                    category,
                    content
                }`;
                const result = await client.fetch(query);
                setBlogs(result);
                setFilteredBlogs(result);
            }  
            else {
                setBlogs([]);
                setFilteredBlogs([]);
            }
        }
        fetchSavedBlogs();
    }, [savedItems]);


    // Filter blogs based on search query and selected category
    useEffect(() => {
        let filtered = blogs;

        if (selectedCategory !== "") {
            filtered = filtered.filter(blog => blog.category === selectedCategory);
        }

        if (searchQuery !== "") {
            filtered = filtered.filter(blog => 
                blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                blog.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
           
        }

        setFilteredBlogs(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    }, [searchQuery, selectedCategory, blogs]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    }

    

    const handlePageChange = useCallback((pageNumber, event) => {
        event.preventDefault();
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    }, [filteredBlogs]);



    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredBlogs.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

    const uniqueCategories = [...new Set(blogs.map(item => item.category))]

    const truncate = (str, num) => 
        str.length <= num ? str : str.slice(0, num) + '...';
        
    

    const formatDateToLocalTime = (dateString) => {
        const date = new Date(dateString);
        const options = {
            day: '2-digit',
            month : 'short',
            year: 'numeric',
        }
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    }


    const handleCardClick = (e, slug) => {
        e.preventDefault();
        if(!isUserAuthenticated) {
            return;
        }
     
        else {
            window.location.href = `/blog/${slug}`;
        }
    }


    const handleToggleSaveItem = (item) => {
        toggleSaveItem(item);
        setBlogs(blogs.filter((blog) => blog._id !== item._id));
        setFilteredBlogs(filteredBlogs.filter((blog) => blog._id !== item._id));
    };



    if (filteredBlogs.length === 0) {
        return (
            <div className="w-full min-h-screen flex  items-center justify-center ">
                <h1 className="text-2xl font-bold mb-4">No saved blogs found</h1>
              
            </div>
        );
    }   

    return (
        <div className="w-full min-h-screen pt-[10vh] p-6 dark:bg-gray-900">
            {filteredBlogs.length >= 6 && (
                <div className="mb-6">
                    <SearchBar onSearch={handleSearch} />

                </div>
                
            )}

            {blogs.length > 6 && (
                <div className="flex justify-center space-x-5 my-4 p-7 items-center">
                    <button className={`btn ${selectedCategory === "" ?
                        "bg-blue-600 text-white py-3 px-6 rounded-full shadow-md" :
                        ""}
                        hover:text-blue-600 dark:hover:text-blue-400 capitalize`}
                        onClick={() => setSelectedCategory("")}>
                        All

                    </button>

                    {uniqueCategories.map((category) => (
                        <button key={category} className={`btn ${selectedCategory === category ?
                            "bg-blue-600 text-white py-3 px-6 rounded-full shadow-md" :
                            ""}
                            hover:text-blue-600 dark:hover:text-blue-400 capitalize`}
                            onClick={() => setSelectedCategory(category)}>
                            {category}
                        </button>
                    ))} 
                </div>
            )}

            <div className= "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 place-items-center mx-auto">

                {paginatedData.map((item) => {
                    const imgUrl = item.imageURL ? item.imageURL : item.mainImageUrl;

                    return (
                        <div key={item._id} className="w-full max-w-[400px] cursor-pointer"
                            onClick={(e) => handleCardClick(e, item.slug)}
                        >
                            <Card className="w-full h-[450px] flex flex-col justify-between rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 bg-white dark:bg-gray-800 dark:text-white p-0">

                            <div className= "relative w-full h-60 overflow-hidden mt-0 ">

                                <Image
                                    src = {imgUrl}
                                    alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        style={{ objectFit: "cover" }}
                                    priority={true}
                                    className="rounded-t-lg "
                                 
                                    />
                                     <div className="absolute inset-0 bg-black/10 opacity-10"></div>
                            </div>

                                <div className="p-4 flex flex-col justify-between flex-grow">
                                    <div className="flex flex-col mb-4">
                                        <CardTitle className="text-lg font-bold mb-2">
                                            {truncate(item.title, 40)}
                                        </CardTitle>


                                        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {truncate(item.description, 100)}
                                        </CardDescription>

                                        <div className="mt-auto relative">
                                            <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                                                {item.author} - {formatDateToLocalTime(item.dateCreated)}
                                            </CardDescription>
                                        
                                        
                                            <button
                                                onClick={() => (
                                                    window.location.href = `/blog/${item.slug}`,
                                                )}
                                                className="mt-4 text-sm font-medium text-blue-600 dark-text-blue-400 hover:underline">
                                                Read More
                                            </button>
                                            
                                            {isUserAuthenticated && (
    
                                                <div
                                                    className="absolute bottom-2 right-2 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleSaveItem(item);
                                                    }}
                                                >
                                                    {savedItems.includes(item._id) ? (
                                                        <FaHeart className="text-red-500" size={24} />
                                                    ) : (
                                                        <FaRegHeart className="text-red-500" size={24} />
                                                    )}

                                                </div>
                                            )}
                                        </div>

                                    </div>
                            </div>
                           
                                
                            </Card>

                        </div>
                            
                    )
                })}
            </div>


            {totalPages> 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination>
                        <PaginationContent>
                            <PaginationPrevious
                                onClick={(e) => handlePageChange(currentPage - 1, e)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </PaginationPrevious>

                            {Array.from({ length: totalPages }, (_, index) => (
                                <PaginationItem key={index + 1}>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => handlePageChange(index + 1, e)}
                                        className={currentPage === index + 1 ? 'bg-blue-600 text-white' : ''}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationNext
                                onClick={(e) => handlePageChange(currentPage + 1, e)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </PaginationNext>
                            
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
       
      
        </div>
    )
}