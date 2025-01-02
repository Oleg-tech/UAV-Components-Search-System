import React, { useState, useEffect } from "react";
import cancel from "./cancel.png";

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

export const CartProduct = (props) => {
    const { name, imageURL, externalURL, price, shopName } = props.data;
    const cartIndex = props.cartIndex;
    let cartItems = props.cartItems;
    const setCartItems = props.setCartItems;

    const deleteFromCart = () => {
        const updatedCart = [...cartItems];
        updatedCart.splice(cartIndex, 1);
        setCartItems(updatedCart);
        localStorage.setItem('favorites', JSON.stringify(updatedCart));
    };

    return (
        <div class="col-md-3 col-lg-3 mb-1 mb-lg-1">
            <div class="card custom-card" style={{ border: "1px solid gray" }}>
                <div class="d-flex justify-content-between pr-3 pt-3">
                    <div class="d-flex align-items-center"><p class="lead mb-0"></p></div>
                    <button
                        style={{
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer'
                        }}
                        onClick={deleteFromCart}
                    >
                        <img src={cancel} alt="Delete"  style={{ width: '40px', height: 'auto', marginRight: "5px" }}/>
                    </button>
                </div>
                <a href={externalURL} target="_blank" class="card-link">
                    <img 
                        src={imageURL}
                        class="card-img-top custom-img mt-0" 
                        alt={name}
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
                            <h5 class="mb-0 clamp-text">{name}</h5>
                        </div>

                        <div class="d-flex justify-content-between">
                            <h5 class="text-dark mb-0">
                                {formatPrice(price)}
                            </h5>
                        </div>

                        <div class="d-flex justify-content-between pt-1 mb-2">
                            <p class="text-muted mb-0 larger-text">{shopName}</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};
