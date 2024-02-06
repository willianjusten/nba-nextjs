"use client"

import { useState } from "react"
import { StandingTable } from "@/components";
import cn from "classnames";

export default function SwitchConference({east, west}) {
    const [conference, setConference] = useState('east');
    const toggleConference = () => {
        setConference(prevConference => {
            const currentConference = prevConference === "east" ? "west" : "east";
            return currentConference;
        });
    }

    return (
        <>
            <div className="inline-flex">
                <button 
                    onClick={toggleConference} 
                    className={cn("bg-transparent font-semibold text-white-500 py-2 px-4 mr-4 border border-white-300 transition-all duration-200 hover:cursor-pointer rounded hover:opacity-60",
                        conference === "east" && "text-blue-500 border-blue-500")}>
                    East
                </button>
                <button 
                    onClick={toggleConference} 
                    className={cn("bg-transparent font-semibold text-white-500 py-2 px-4 mr-4 border border-white-300 transition-all duration-200 hover:cursor-pointer rounded hover:opacity-60",
                        conference === "west" && "border-blue-500 text-blue-600")}>
                    West
                </button>
            </div>
            {conference === 'east' && <StandingTable label="Eastern Conference" conference={east} />}
            {conference === 'west' && <StandingTable label="Western Conference" conference={west} />}
        </>
    )
}