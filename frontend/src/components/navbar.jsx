import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import "./logo-animation.css";
import logo from "./drone_to_edit_logo.png";

export const Navbar = () => {
    const [isAnimating, setIsAnimating] = useState(true);

    useEffect(() => {
        const logoElement = document.getElementById("logo");
        console.log("ANIMATION = ", isAnimating);
        if (logoElement) {
            if (isAnimating) {
                logoElement.classList.add("rotate");
            } else {
                logoElement.classList.remove("rotate");
            }
        }
    }, [isAnimating]);

    return (
        <div className="navbar" style={{ position: "fixed", top: "0", width: "100%", zIndex: "1000"}}>
            <div className="links">
                <Link to="/home">
                    <img
                        id="logo"
                        src={logo}
                        alt="Home"
                        style={{ width: '60px', height: 'auto' }}
                        onClick={() => setIsAnimating(!isAnimating)}
                    />
                </Link>
                <Link to="/search">Пошук комплектуючих</Link>
                <Link to="/categories">Категорії</Link>
                <Link to="/kits">Набори</Link>
                <Link to="/cart" style={{ position: 'absolute', right: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16" style={{ width: '40px', height: 'auto' }}>
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                </Link>
            </div>
        </div>
    );
};
