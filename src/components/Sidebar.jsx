import React, { useEffect, useRef } from 'react';
import {CommandLog} from "./CommandLog.jsx";

export function Sidebar({ log }) {
    // 1. Create the reference for the "bottom" element
    const logEndRef = useRef(null);

    // 2. Setup the effect to scroll whenever the 'log' changes

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [log]); // This triggers every time a new entry is added to the log

    return (
        <div>
            <h3 style={{ margin: '0 0 16px 0' }}>Chat History</h3>

            {/* Your log component */}
            <CommandLog log={log} />

            {/* 3. The dummy div that stays at the very end of the content */}
            <div
                ref={logEndRef}
                style={{ height: '1px', width: '100%' }}
            />
        </div>
    );
}