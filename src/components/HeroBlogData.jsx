"use client";

import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination'
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { SavedItemsContext } from '@/context/SavedItems';
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';
import SearchBar from './SearchBar';

export default function HeroBlogData({ data, isUserAuthenticated }) {
    const [filteredData, setFilteredData] = useState(data);


    const [selectedCategory, setSelectedCategory] = useState('');

    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);

    const { savedItems, toggleSaveItem } = useContext(SavedItemsContext);


    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const uniqueCategories = [...new Set(data.map((item) => item.category))];
    // const uniqueCategories = [...new Set((Array.isArray(data) ? data : []).map(item => item.category))];

    const handleSearch = (query) => {
        setSearchQuery(query.toLowerCase());
    
    }


    useEffect(() => {

        let filtered = data;
        if (selectedCategory) {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }
        if (searchQuery) {
            filtered = filtered.filter(item => 
                item.title.toLowerCase().includes(searchQuery) || 
                // item.description.toLowerCase().includes(searchQuery) || 
                item.author.toLowerCase().includes(searchQuery)
            );
        }

        // Add this line to sort by views descending
        filtered = filtered.slice().sort((a, b) => (b.views || 0) - (a.views || 0));
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page when filters change

    }, [data, selectedCategory, searchQuery]);
  
  
    const truncate = (str, num) => {
        return str.length <= num ? str : str.slice(0, num) + '...';
    }
  

    const formatDateToLocalTime = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }
        return date.toLocaleDateString('en-GB', options);
    }
  

    const handlePageChange = useCallback((pageNumber, event) => { 
        event.preventDefault();
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    }, [totalPages]);


    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);


    const generatePaginationItems = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <PaginationItem key={i} className="cursor-pointer">
                    <PaginationLink
                        href="#"
                        onClick={(e) => handlePageChange(i, e)}
                        className={currentPage === i ? 'bg-red-600 font-bold text-primary-foreground' : ''}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    }


    const incrementView = async (postId) => {
        try {
          await fetch("/api/incrementView", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId }),
          });
        } catch (error) {
          console.error("Failed to increment view:", error);
        }
      };

    return (
        <div className="w-full h-full p-6 dark:bg-gray-900">
            
            {/* Search bar */}
            <SearchBar onSearch={handleSearch} />


            {/* category selection */}
            <div className="flex overflow-x-auto  space-x-4 my-4 p-4 md:p-7 scrollbar-hide w-full items-center">
                
                <button
                    className={` btn  py-2 ${selectedCategory === ""  ? 'bg-blue-500 text-white py-3 px-6 rounded-full shadow-md ' : ''} hover:text-white-600 dark:hover:text-blue-400 capitalize`}
                    onClick={() => setSelectedCategory('')}>
                    All
                </button>
                
                
                {uniqueCategories.map((category) => (
                    <button
                        key={category}
                        className={`btn ${selectedCategory === category ? 'bg-blue-500 text-white py-3 px-6 rounded-full shadow-md' : ''} hover:text-white-900   dark:hover:text-blue-600 capitalize`}
                        onClick={() => setSelectedCategory(category)}>
                        {category}
                    </button>
                ))}
                

            </div>

           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6 place-items-center mx-auto ">
                {paginatedData?.map((item) => {
                    const imageUrl = item.imageUrl ? item.imageUrl : item.mainImageUrl;
                    
                    return (
                        <div key={item._id}
                            className="w-full max-w-[400px] cursor-pointer">
                            {isUserAuthenticated ? (

                                // <a href={`/blog/${item.slug}`} >
                                    <Card className="w-full h-[450px] flex flex-col justify-between  rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 bg-white dark:bg-gray-800 dark:text-white pt-0 mt-0">
                                    
                                        <div className="relative w-full h-60 overflow-hidden mt-0 pt-0">
                                            <Image                                      
                                                src={imageUrl}
                                                alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 400px" // adjust 400px to your card width if needed
                                            style={{ objectFit: "cover" }}
                                                className="rounded-t-lg "
                                                priority={true}
                                            />

                                            <div className="absolute inset-0 bg-black opacity-20"> </div>

                                            </div>
                                    
                                        <div className="p-4 flex flex-col justify-between  flex-grow">
                                            <div className="flex flex-col mb-4">
                                                <CardTitle className="text-lg font-bold mb-2">
                                                    {truncate(item.title, 40)}
                                                </CardTitle>


                                                <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {truncate(item.description, 100)}
                                                </CardDescription>

                                            </div>

                                            <div className="relative mt-auto">

                                                <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                                                    By {item.author} | {formatDateToLocalTime(item.dateCreated)} | <span className="text-white font-extrabold">{item.views || 0} views </span>


                                                </CardDescription>

                                                <button
                                                // onClick = {() => window.location.href = `/blog/${item.slug}`}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    await fetch("/api/incrementView", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ postId: item._id }),
                                                      });
                                                    window.location.href = `/blog/${item.slug}`;
                                                    }}
                                                    className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                    Read More 

                                            </button>
                                            
                                            <div
                                                onClick = {(e)=> {
                                                    e.stopPropagation();
                                                    toggleSaveItem(item)
                                                }}
                                                className="absolute bottom-2 right-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                                                >
                                                {savedItems.includes(item._id) ? (
                                                    <FaHeart className=" text-red-500 " size={24} />
                                                ) : (
                                                    <FaRegHeart className=" text-red-500 " size={24} />
                                                )}

                                            </div>
                                            
                                                
                                            
                                            </div>

                                        </div>
                                    </Card>

                                 /* </a> */
                            ) : (
                                    <LoginLink>
                                        <Card className="w-full h-[450px] flex flex-col justify-between rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 bg-white dark:bg-gray-800 dark:text-white">
                                            

                                            <div className="relative w-full h-60 overflow-hidden">

                                            <Image
                                                src={imageUrl}
                                                alt={item.title}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-t-lg "
                                                priority={true}
                                                />
                                                
                                                <div className = "absolute inset-0 bg-black opacity-20">
                                                </div>

                                                </div>
                                          
                                    <div className="p-4 flex flex-col justify-between  flex-grow">
                                        
                                            <div className="flex flex-col mb-4">
                                        
                                        
                                            <CardTitle className="text-lg font-bold mb-2">
                                                    {truncate(item.title, 40)}
                                                </CardTitle>


                                                <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {truncate(item.description, 100)}
                                                </CardDescription>

                                            </div>

                                            <div className="relative mt-auto">

                                                <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                                                    By {item.author} | {formatDateToLocalTime(item.dateCreated)}


                                                </CardDescription>

                                                <button
                                                    onClick = {() => window.location.href = `/blog/${item.slug}`}
                                                    className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                    Read More 

                                            </button>
                                            
                                            {/* <div
                                             onClick = {(e)=> {
                                                e.stopPropagation();
                                                    toggleSaveItem(item._id);
                                                }}
                                                className="absolute bottom-2 right-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                                                {savedItems.includes(item._id) ? (
                                                    <FaHeart className=" text-red-500 " size={24}/>
                                                ) : (
                                                    <FaRegHeart className=" text-red-500 " size={24} />
                                                )}

                                            </div> */}
                                            
                                                
                                            
                                            </div>

                                        </div>
                                           
                                        </Card>
                                       

                                    </LoginLink>
                            

                            )
                            }
                

                        </div>
                    )
                    
                })}
                
            </div>

            <div className="w-full h-full flex flex-col items-center p-10">
                {totalPages > 1 && (
                    <Pagination>
                        <PaginationContent className="cursor-pointer">
                            <PaginationItem>
                                <PaginationPrevious onClick= {(e) => handlePageChange(currentPage - 1, e)} disabled={currentPage === 1}/>
                            </PaginationItem>
                            {generatePaginationItems()}

                            <PaginationItem>
                                <PaginationNext onClick= {(e) => handlePageChange(currentPage + 1, e)} disabled={currentPage === totalPages}/>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                    )}
                
            </div>

        </div>
  )
}

