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

export const Product = ({data, index, setInstruction, downloadKit}) => {
    const { componentDescription, componentImageURL } = data;

    console.log("NeIndex = ", index);

    const componentPrice = Object.values(componentDescription).reduce((acc, [link, price]) => acc + parseFloat(price), 0);

    return (
        <div class="col-md-3 col-lg-3 mb-1 mb-lg-1" style={{ width: "420px" }}>
            <div class="card custom-card" style={{ border: "1px solid gray" }}>
                <div class="d-flex justify-content-between pr-3 pt-3">
                    <div class="d-flex align-items-center"><p class="lead mb-0"></p></div>
                        <button
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => downloadKit(index)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "20px" }} width="20px" height="20px" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                            </svg>
                        </button>
                </div>
                <img 
                    src={componentImageURL}
                    class="card-img-top custom-img mt-0"
                    style={{
                        minHeight: "200px",
                        maxHeight: "200px",
                        minWidth: "300px",
                        maxWidth: "300px",
                        margin: "auto"
                    }}
                />
                <div class="card-body">
                    <div class="justify-content-between mb-3" style={{ height:"480px" }}>
                    {Object.entries(componentDescription).map(([description, [link, price]], index) => (
                        <div key={index}>
                            <h5 class="mb-0 clamp-text" style={{ fontSize: "15px", maxHeight: "50px", minHeight: "50px" }}>
                                <a href={link} target="_blank" rel="noopener noreferrer">{description}</a>: {formatPrice(price)}
                            </h5>
                        </div>
                    ))}
                    </div>

                    <div class="d-flex justify-content-between">
                        <h5 class="text-dark mb-0">
                            {formatPrice(componentPrice)}
                        </h5>
                    </div>

                    <div align="center" style={{marginTop: "15px"}}>
                        <button 
                            className="btn btn-success"
                            onClick={() => setInstruction(index)}
                        >
                            Детальніше
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
