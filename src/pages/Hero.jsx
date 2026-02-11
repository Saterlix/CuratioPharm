import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <div className="hero-section">
            <div className="hero-animated-bg">
                <div className="hero-floating-shapes">
                    <div className="hshape hshape-cross hs-1"></div>
                    <div className="hshape hshape-circle hs-2"></div>
                    <div className="hshape hshape-cross hs-3"></div>
                    <div className="hshape hshape-pill hs-4"></div>
                </div>
            </div>
            <div className="hero-overlay"></div>
        </div>
    );
};

export default Hero;
