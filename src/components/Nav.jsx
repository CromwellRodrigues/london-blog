import React, { useContext } from "react";
import Link from "next/link";
import { ModeToggle } from "./modeToggle";
import HamburgerNav from "./HamburgerNav";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';


export async function Nav() {

    const { getUser } = getKindeServerSession();
    const user = await getUser();
    console.log("User in Nav:", user);

    // const isAuthenticated = getKindeServerSession(); // Check if user is authenticated
    // const isUserAuthenticated = await isAuthenticated;
    const isUserAuthenticated = !!user;
    console.log("Is User Authenticated:", isUserAuthenticated);
    

    return (
    <nav className="w-full h-[8vh] fixed top-0 left-0 right-0 bg-black text-white flex items-center justify-between px-4 font-poppins capitalize z-50">
        
            <div className="flex items-center text-white p-3">
                <Link href="/" >
                    <h1 className="font-bold ">
                        London Blog
                    </h1>
                </Link>
            </div>
            
            <div className="flex items-center space-x-4">
                <ModeToggle />
                <HamburgerNav
                    user={user} // Pass user to HamburgerNav
                    isUserAuthenticated={isUserAuthenticated} // Pass authentication status
                />
            </div>
            {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
    </nav>
    )
}