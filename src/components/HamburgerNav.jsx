// Nav will be a server component and hamburger will be a client component
"use client";

import React, {useRef, useState, useContext, useEffect} from 'react';
import MenuIcon  from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { SavedItemsContext } from "@/context/SavedItems"; // Importing context to access saved items
import { Close } from '@mui/icons-material';
import Image from 'next/image';
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import Link from 'next/link';
import { Badge } from '@mui/material';

import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Button } from './ui/button';

const HamburgerNav = ( { user, isUserAuthenticated}) => {
    const [open, setOpen] = useState(false); // State to manage the open/close status of the menu
    const menuRef = useRef(null); // Reference to the menu element


    const { savedItems } = useContext(SavedItemsContext); // Accessing saved items from context

    const handleOpen = () => {
        setOpen(true); // Function to open the menu

    }


    const handleClose = () => {
        setOpen(false); // Function to close the menu
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false); // Close the menu if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Cleanup event listener on unmount
    

    const { id, given_name, picture } = user || {}; // Destructuring user object to get id, name, and picture

    return (
        <>
            <div className="p-3 cursor-pointer z-50 ">
                <MenuIcon onClick={handleOpen} className=" h-8 w-8 hover:text-foreground" />

            </div>

            <div
                ref={menuRef}
                className={`fixed top-[0] right-0 h-full z-50 md:w-[35%] w-full bg-black/90 transform ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-40  ${!open ? 'pointer-events-none' : ''}`}>
                
                <div className="flex items-center justify-end p-5 font-bold">
                    <CloseIcon onClick={handleClose} className="h-8 w-8 cursor-pointer hover:text-destructive " />
                    
                </div>

            <div className="w-full h-[50%] flex justify-center items-center">

                    <ul className=" text-white flex flex-col justify-center items-center">
                        {!isUserAuthenticated ? (
                            <>
                            <li className="p-5">
                                    <LoginLink onClick={handleClose} >
                                        <h3 className="transform transition duration-300 hover:text-foreground">
                                            Login
                                        </h3>
                                    </LoginLink>
                                </li>

                                <li className="p-5">
                                    <RegisterLink onClick={handleClose} >
                                        <h3 className="transform transition duration-300 hover:text-foreground">
                                         Register
                                        </h3>
                                    </RegisterLink>
                                </li>
                                </>
                        ) : (
                            <>
                                <li className="p-5 text-2xl capitalize flex flex-col items-center">
                                        <Image key={id} src={picture} alt={`${given_name}'s  profile picture`} width={100} height={100} className="rounded-full border-2" />

                                        <h2 className ="mt-4 transform transition duration-300">

                                            Hi, {given_name}
                                        </h2>
                                    </li>
                                    

                                        <li className="relative p-5">
                                            <Link href="/saved" onClick={handleClose}>
                                            
                                                <Badge badgeContent={savedItems.length} color="secondary">

                                                    <SaveIcon className="dark:text-white text-[5vmin] h-8 w-8 cursor-pointer hover:text-foreground" />
                                                
                                                </Badge>

                                            </Link>
                                       
                                        </li>
                                    
                                    <li className="p-5">
                                        <LogoutLink onClick={handleClose} >
                                            <Button variant="destructive" >
                                                <h3 className="dark:text-white">
                                                    Logout

                                                </h3>
                                            </Button>
                                            
                                        </LogoutLink>

                                        </li>
                               
                            </>
                        )}
                        
                </ul>
            </div>

                
            
            </div>

        </>
    )
}
export default HamburgerNav