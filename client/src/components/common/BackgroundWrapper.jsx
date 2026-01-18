import React from 'react';

const BackgroundWrapper = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full">
            {/* Background Image Layer */}
            <div
                className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat opacity-10 pointer-events-none"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1596401057633-565651631758?q=80&w=2670&auto=format&fit=crop')", // Mandir placeholder
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
