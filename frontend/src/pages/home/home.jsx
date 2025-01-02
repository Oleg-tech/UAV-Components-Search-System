import React, { useRef, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import "./animation.css";

import logo1 from "./drone-home-1.png";
import logo2 from "./drone-home-2.png";
import logo3 from "./drone-home-3.png";
import logo4 from "./drone-home-4.png";
import logo5 from "./drone-home-5.png";

export const Home = () => {
    const navigate = useNavigate();

    const imgRef1 = useRef(null);
    const imgRef2 = useRef(null);
    const imgRef3 = useRef(null);
    const imgRef4 = useRef(null);
    const imgRef5 = useRef(null);

    const [animationCounter, setAnimationCounter] = useState(0);

    const generateRandomCoordinates = () => {
        const randomAngle = Math.floor(Math.random() * 181) - 90;
        const randomTop = Math.floor(Math.random() * 81);
        const randomLeft = Math.floor(Math.random() * -1200) - 300;
        return { randomAngle, randomTop, randomLeft };
    };
    
    useEffect(() => {
        const generateRandomCoordinates = () => {
            const randomAngle = Math.floor(Math.random() * 181) - 90;
            const randomTop = Math.floor(Math.random() * 81);
            const randomLeft = Math.floor(Math.random() * -1200) - 300;
            return { randomAngle, randomTop, randomLeft };
        };
    
        const animateImage = (imgRef) => {
            const { randomAngle, randomTop, randomLeft } = generateRandomCoordinates();
            
            if (imgRef.current) {
                imgRef.current.style.transform = `rotate(${randomAngle}deg)`;
                imgRef.current.style.top = `${randomTop}%`;
                imgRef.current.style.left = `${randomLeft}px`;
                imgRef.current.style.transition = "left 1s";
            }
        };
    
        const handleAnimationIteration = (imgRef) => {
            animateImage(imgRef);
        };
    
        const imgRefs = [imgRef1, imgRef2, imgRef3, imgRef4, imgRef5];
        
        imgRefs.forEach(imgRef => {
            if (imgRef.current) {
                imgRef.current.addEventListener('animationiteration', () => handleAnimationIteration(imgRef));
            }
        });
    
        return () => {
            imgRefs.forEach(imgRef => {
                if (imgRef.current) {
                    imgRef.current.removeEventListener('animationiteration', () => handleAnimationIteration(imgRef));
                }
            });
        };
    }, []);
    

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div align="center" className="col-md-6 d-flex justify-content-end align-items-center" style={{ paddingRight: "270px", zIndex: "1000" }}>
              <Link to="/search" className="btn btn-dark">
                Перейти до пошуку комплектуючих
              </Link>
            </div>
            <img ref={imgRef1} src={logo1} alt="Flying Drone" className="fly-across-1" />
            <img ref={imgRef2} src={logo2} alt="Flying Drone" className="fly-across-2" />
            <img ref={imgRef3} src={logo3} alt="Flying Drone" className="fly-across-3" />
            <img ref={imgRef4} src={logo4} alt="Flying Drone" className="fly-across-4" />
            <img ref={imgRef5} src={logo5} alt="Flying Drone" className="fly-across-5" />
        </div>
    );
};
