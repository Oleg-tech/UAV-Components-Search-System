import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import cancel from "./cancel.png";

export const CartKit = (props) => {
    const { componetsList, battery, frame } = props.data;
    const cartIndex = props.cartIndex;
    let cartKits = props.cartKits;
    const setCartKits = props.setCartKits;

    const deleteFromCart = () => {
        const updatedCart = [...cartKits];
        updatedCart.splice(cartIndex, 1);
        setCartKits(updatedCart);
        localStorage.setItem('favorite_kits', JSON.stringify(updatedCart));
    };

    const downloadComponent = () => {
        try {
            const headers = ["Назва", "Кількість"];
            const data = [headers];
        
            for (const [key, value] of Object.entries(componetsList)) {
                data.push([key, value]);
            }
            
            data.push([" ", " "]);

            data.push(["Вимоги до батареї", battery]);

            data.push([" ", " "]);

            data.push(["Вимоги до рами", " "]);
            for (const [key, value] of Object.entries(frame)) {
                data.push([key, value]);
            }

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, 'Kits');
            XLSX.writeFile(wb, 'cart-kits.xlsx');
        } catch (err) {
          console.error('Error:', err);
        }
    };

    const frameEntries = Object.entries(frame);
    const selectedComponents = Object.entries(componetsList);
    console.log("SELECTED COMPONENTS = ", selectedComponents);
  
    return (
      <div className="col-md-3 col-lg-3 mb-1 mb-lg-1" style={{ width: "30%" }}>
        <div className="card custom-card" style={{ border: "1px solid gray", height: "620px" }}>
            <div className="d-flex justify-content-between pr-3 pt-3">
                <div className="d-flex align-items-center">
                    <button onClick={downloadComponent} style={{ border: 'none', background: 'none', marginRight: "50px", marginTop: "20px", marginLeft: "40px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                        </svg>
                    </button>
                <p className="lead mb-0"></p>
                </div>
                <button
                    style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer'
                    }}
                    onClick={deleteFromCart}
                >
                <img src={cancel} alt="Delete" style={{ width: '40px', height: 'auto', marginRight: "5px" }} />
                </button>
            </div>
            <div className="card-body">
                <h2 align="center" className="text-dark mb-3" style={{ fontSize: "20px" }}>
                    Список необхідних комплектуючих
                </h2>
                {Object.keys(componetsList).map((key) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: "14px" }}>
                        <h3 style={{ fontSize: "14px" }}>{key}</h3>
                        <p style={{ marginLeft: 'auto' }}>{componetsList[key] === 1 ? '1 шт.' : `${componetsList[key]} шт.`}</p>
                    </div>
                ))}

                <h5 className="text-dark mb-0 mt-3" style={{ fontSize: "15px" }}>
                    Вимоги до батареї: {battery}
                </h5>

                <h2 className="text-dark mb-0 mt-3" style={{ fontSize: "15px" }}>Вимоги до рами</h2>
                <ul className="text-muted mb-0 larger-text" style={{ fontSize: "12px" }}>
                    {frameEntries.map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    );
};
