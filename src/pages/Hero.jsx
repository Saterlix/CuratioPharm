import React from 'react';
import navbarVideo from '../assets/Navber-video.mp4';
import './Hero.css';

const Hero = () => {
    return (
        <div className="hero-section">
            <video className="hero-video" autoPlay loop muted playsInline>
                <source src={navbarVideo} type="video/mp4" />
            </video>
            <div className="hero-overlay"></div>
        </div>
    );
};

export default Hero;
