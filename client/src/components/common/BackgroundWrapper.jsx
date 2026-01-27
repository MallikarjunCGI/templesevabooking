import React from 'react';

const BackgroundWrapper = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full">
            {/* Background Image Layer */}
            <div
                className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
                style={{
                     // Local mandir placeholder
                    backgroundColor: '#FFF8E1' // Warm light base
                }}
                aria-hidden="true"
            />

            {/* Content Layer */}
            <div className="relative z-0">
                {children}
            </div>
        </div>
    );
};

export default BackgroundWrapper;
