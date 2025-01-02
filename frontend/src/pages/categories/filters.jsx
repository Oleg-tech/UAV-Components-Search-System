import React, { useEffect, useState, useRef } from 'react';
import "./price-range-filter.css";
import "./checkbox.css";


export const Filter = ({
    category,
    shops, selectedShops, setSelectedShops,
    countries, selectedCountries, setSelectedCountries, 
    companies, selectedCompanies, setSelectedCompanies,
    parameters, selectedParameters, setSelectedParameters
  }) => {

  const handleShopChange = (shop) => {
    if (selectedShops.includes(shop)) {
      setSelectedShops(selectedShops.filter((s) => s !== shop));
    } else {
      setSelectedShops([...selectedShops, shop]);
    }
    console.log("Selected shops = ", selectedShops);
  };

  const handleCountryChange = (country) => { 
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter((s) => s !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  const handleCompanyChange = (company) => {    
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(selectedCompanies.filter((s) => s !== company));
    } else {
      setSelectedCompanies([...selectedCompanies, company]);
    }
    console.log("Selected companies = ", selectedCompanies);
  };

  const handleParameterChange = (param, value) => {
    if (selectedParameters.hasOwnProperty(param)) {
      if (selectedParameters[param].includes(value)) {
        const updatedValues = selectedParameters[param].filter(v => v !== value);
        setSelectedParameters({
          ...selectedParameters,
          [param]: updatedValues
        });
      } else {
        setSelectedParameters({
          ...selectedParameters,
          [param]: [...selectedParameters[param], value]
        });
      }
    } else {
      setSelectedParameters({
        ...selectedParameters,
        [param]: [value]
      });
    }
    
    console.log("Selected parameters =", selectedParameters);
  };

  if (category == null) {
    return null;
  }

  return (
      <div 
        className="filter-container"
      >
        {Array.isArray(shops) && shops.length > 0 ? (
        <div style={{ paddingTop: "0" }}>
          <h5 className="w3-bar-item sub-title" style={{ fontSize: "17px", paddingLeft: "30px" }}>Магазини</h5>
            <ul className="shop-list" style={{ paddingLeft: "30px" }}>
              {shops.map((shop, index) => (
                <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px", fontSize: "15px" }}>
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedShops.includes(shop)}
                      onChange={() => handleShopChange(shop)}
                    />
                    <span className="checkmark"></span>
                    <span className="label-text" style={{ fontSize: "15px" }}>{shop}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ) : null
        }

        {Array.isArray(countries) && countries.length > 0 ? (
          <div style={{ marginTop: "0px" }}>
            <h5 className="w3-bar-item sub-title" style={{ fontSize: "17px", paddingLeft: "30px" }}>Країни</h5>
              <ul className="shop-list" style={{ paddingLeft: "30px", fontSize: "15px" }}>
                {countries.map((country, index) => (
                  <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "2px", paddingTop: "2px" }}>
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCountries.includes(country)}
                        onChange={() => handleCountryChange(country)}
                      />
                      <span className="checkmark"></span>
                      <span className="label-text" style={{ fontSize: "15px" }}>{country}</span>
                    </label>
                  </li>
                ))}
              </ul>
          </div>
        ) : 
          null
        }

        {Array.isArray(companies) && companies.length > 0 && (
          <div style={{ marginTop: "5px" }}>
            <h5 className="w3-bar-item sub-title" style={{ fontSize: "17px", paddingLeft: "30px" }}>Виробники</h5>
            <ul className="shop-list" style={{ paddingLeft: "30px", fontSize: "15px" }}>
              {companies.map((company, index) => (
                <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "4px", paddingTop: "4px" }}>
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company)}
                      onChange={() => handleCompanyChange(company)}
                    />
                    <span className="checkmark"></span>
                    <span className="label-text" style={{ fontSize: "15px" }}>{company}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {Object.entries(parameters).map(([param, values]) => (
          <div style={{ marginTop: "5px" }} key={param}>
            <h5 className="w3-bar-item sub-title" style={{ paddingLeft: "30px", fontSize: "17px" }}>{param}</h5>
            {Array.isArray(values) && values.length > 0 ? (
              <ul className="shop-list" style={{ paddingLeft: "30px", fontSize: "17px" }}>
                {values.map((value, index) => (
                  <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "4px", paddingTop: "4px", fontSize: "15px" }}>
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedParameters[param] ? selectedParameters[param].includes(value) : false}
                        onChange={() => handleParameterChange(param, value)}
                      />
                      <span className="checkmark"></span>
                      <span className="label-text" style={{ fontSize: "15px" }}>{value}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

      </div>
  );
};
