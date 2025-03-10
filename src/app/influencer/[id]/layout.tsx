"use client"
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function InfluencerLayout({
    children
}:{children:React.ReactNode}
){
    const {data:session} = useSession()
    const {connected} = useWallet();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Add a small delay to ensure wallet state is properly initialized
        const timer = setTimeout(() => {
            if (!connected && !session) {
                router.push('/');
            }
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [connected, router , session]);

    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <div className=" bg-black space-y-4" >
            <Navbar bg="bg-black"/>
            {children}
        </div>
    );
}