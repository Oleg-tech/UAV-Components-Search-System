import React, { useState, useEffect } from "react";
import { SuitHeart } from 'react-bootstrap-icons';

const formatPrice = (price) => {
    if (typeof price === 'string') {
      const [minPrice, maxPrice] = price.split(' - ');

      if (maxPrice) {
        return `${parseFloat(minPrice).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ${parseFloat(maxPrice).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`;
      } else {
        return `${parseFloat(minPrice).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`;
      }
    }
  
    return `${price.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₴`;
};

export const Product = (props) => {
    const { componentName, componentPrice, componentImageURL, componentExternalURL, componentShopName } = props.data;

    const [isDuplicate, setIsDuplicate] = useState(false);

    const addToFavorites = () => {
        const item = {
          name: componentName,
          imageURL: componentImageURL,
          price: componentPrice,
          externalURL: componentExternalURL,
          shopName: componentShopName
        };

        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.push(item);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        setIsDuplicate(true);
    };

    const deleteFromFavorites = () => {
        const updatedCart = JSON.parse(localStorage.getItem('favorites')) || [];
        const index = updatedCart.findIndex(item => (
            item.name === componentName &&
            item.imageURL === componentImageURL &&
            item.price === componentPrice &&
            item.externalURL === componentExternalURL &&
            item.shopName === componentShopName
        ));
        
        if (index !== -1) {
            updatedCart.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(updatedCart));
            setIsDuplicate(false);
        }
    };

    const findDuplicates = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        setIsDuplicate(
            favorites.some(item => (
                item.name === componentName &&
                item.imageURL === componentImageURL &&
                item.price === componentPrice &&        
                item.externalURL === componentExternalURL &&
                item.shopName === componentShopName
            ))
        );
    }

    useEffect(() => {
        findDuplicates();
    }, []);

    return (
        <div class="col-md-3 col-lg-3 mb-1 mb-lg-1">
            <div class="card custom-card" style={{ border: "1px solid gray" }}>
                <div class="d-flex justify-content-between pr-3 pt-3">
                    <div class="d-flex align-items-center"><p class="lead mb-0"></p></div>
                    {!isDuplicate ? (
                        <button
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer'
                            }}
                            onClick={addToFavorites}
                        >
                            {/* <SuitHeart style={{ fontSize: '24px', marginRight: '10px' }} /> */}
                            <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-cart" style={{ fontSize: '24px', marginRight: '10px' }} width="24px" height="24px" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                            </svg>
                        </button>
                    ) :
                        <button
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer'
                            }}
                            onClick={deleteFromFavorites}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ fontSize: '24px', marginRight: '10px' }} width="24px" height="24px" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </button>
                    }
                </div>
                <a href={componentExternalURL} target="_blank" class="card-link">
                    <img 
                        src={componentImageURL}
                        class="card-img-top custom-img mt-0" 
                        alt={componentName}
                        style={{
                            minHeight: "200px",
                            maxHeight: "200px",
                            minWidth: "300px",
                            maxWidth: "300px",
                            margin: "auto"
                        }}
                    />
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-3">
                            <h5 class="mb-0 clamp-text">{componentName}</h5>
                        </div>

                        <div class="d-flex justify-content-between">
                            <h5 class="text-dark mb-0">
                                {formatPrice(componentPrice)}
                            </h5>
                        </div>

                        <div class="d-flex justify-content-between pt-1 mb-2">
                            <p class="text-muted mb-0 larger-text">{componentShopName}</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};
