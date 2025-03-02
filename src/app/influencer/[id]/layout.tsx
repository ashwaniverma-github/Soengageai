"use client"
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

export default function InfluencerLayout({
    children
}:{children:React.ReactNode}
){
    const {connected} = useWallet();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Add a small delay to ensure wallet state is properly initialized
        const timer = setTimeout(() => {
            if (!connected) {
                router.push('/');
            }
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [connected, router]);

    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <div className=" bg-black" >
            <Navbar bg="bg-black"/>
            {children}
        </div>
    );
}