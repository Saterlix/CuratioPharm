import React from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

const PageTransition = ({ children }) => {
    const location = useLocation();

    return (
        <div className="page-wrapper" key={location.pathname}>
            {children}
        </div>
    );
};

export default PageTransition;
