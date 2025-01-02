import React, { useEffect, useState, useRef } from 'react';
import "./price-range-filter.css";
import "./checkbox.css";

export const Filter = ({
    query, 
    shops, selectedShops, setSelectedShops,
    countries, selectedCountries, setSelectedCountries,
    setMinRangePrice, setMaxRangePrice,
    minRangePrice, maxRangePrice, setMinBufRangePrice, setMaxBufRangePrice, setResetPage, 
    companies, selectedCompanies, setSelectedCompanies,
    parameters, selectedParameters, setSelectedParameters
  }) => {
  // const [isFixed, setIsFixed] = useState(false);
  // const sidebarRef = useRef(null);
  // const sidebarOffsetTop = useRef(null);

  const [minPrice, setMinPrice] = useState(minRangePrice);
  const [maxPrice, setMaxPrice] = useState(maxRangePrice);

  // Зміна ціни
  useEffect(() => {
    const handleSetup = () => {
      setMinPrice(minRangePrice);
      setMaxPrice(maxRangePrice);
    };

    handleSetup();
  }, [minRangePrice, maxRangePrice]);

  // useEffect(() => {
  //   sidebarOffsetTop.current = sidebarRef.current.offsetTop;

  //   const handleScroll = () => {
  //     const scrollPosition = window.pageYOffset;

  //     if (scrollPosition >= sidebarOffsetTop.current) {
  //       setIsFixed(true);
  //     } else {
  //       setIsFixed(false);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  useEffect(() => {
    const rangevalue = document.querySelector(".slider-container .price-slider");
    const rangeInputvalue = document.querySelectorAll(".range-input input");
  
    rangevalue.style.left = `${(minPrice / rangeInputvalue[0].max) * 100}%`;
    rangevalue.style.right = `${100 - (maxPrice / rangeInputvalue[1].max) * 100}%`;
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const rangevalue = document.querySelector(".slider-container .price-slider");
    const rangeInputvalue = document.querySelectorAll(".range-input input");
    const priceInputvalue = document.querySelectorAll(".price-input input");

    let priceGap = 50;

    const handlePriceInputChange = (e) => {
      let minp = parseInt(priceInputvalue[0].value, 10);
      let maxp = parseInt(priceInputvalue[1].value, 10);
      let diff = maxp - minp;

      if (minp < minRangePrice) {
        alert("minimum price cannot be less than 0");
        setMinPrice(minRangePrice);
        minp = minRangePrice;
      }

      if (maxp > maxRangePrice) {
        alert(`maximum price cannot be greater than ${maxRangePrice}`);
        setMaxPrice(maxRangePrice);
        maxp = maxRangePrice;
      }

      if (minp > maxp - priceGap) {
        setMinPrice(maxp - priceGap);
        minp = maxp - priceGap;

        if (minp < minRangePrice) {
          setMinPrice(minRangePrice);
          minp = minRangePrice;
        }
      }

      if (diff >= priceGap && maxp <= rangeInputvalue[1].max) {
        if (e.target.className === "min-input") {
          rangeInputvalue[0].value = minp;
          let value1 = rangeInputvalue[0].max;
          rangevalue.style.left = `${(minp / value1) * 100}%`;
        } else {
          rangeInputvalue[1].value = maxp;
          let value2 = rangeInputvalue[1].max;
          rangevalue.style.right = `${100 - (maxp / value2) * 100}%`;
        }
      }
    };

    const handleRangeInputChange = (e) => {
      let minVal = parseInt(rangeInputvalue[0].value, 10);
      let maxVal = parseInt(rangeInputvalue[1].value, 10);
      let diff = maxVal - minVal;

      if (diff < priceGap) {
        if (e.target.className === "min-range") {
          setMinPrice(maxVal - priceGap);
        } else {
          setMaxPrice(minVal + priceGap);
        }
      } else {
        setMinPrice(minVal);
        setMaxPrice(maxVal);
        rangevalue.style.left = `${(minVal / rangeInputvalue[0].max) * 100}%`;
        rangevalue.style.right = `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`;
      }
    };

    priceInputvalue[0].addEventListener("input", handlePriceInputChange);
    priceInputvalue[1].addEventListener("input", handlePriceInputChange);
    rangeInputvalue[0].addEventListener("input", handleRangeInputChange);
    rangeInputvalue[1].addEventListener("input", handleRangeInputChange);

    return () => {
      priceInputvalue[0].removeEventListener("input", handlePriceInputChange);
      priceInputvalue[1].removeEventListener("input", handlePriceInputChange);
      rangeInputvalue[0].removeEventListener("input", handleRangeInputChange);
      rangeInputvalue[1].removeEventListener("input", handleRangeInputChange);
    };
  }, []);

  const handleShopChange = (shop) => {
    setResetPage(true); // Обнулення пагінації
    
    if (selectedShops.includes(shop)) {
      setSelectedShops(selectedShops.filter((s) => s !== shop));
    } else {
      setSelectedShops([...selectedShops, shop]);
    }
    console.log("Selected shops = ", selectedShops);
  };

  const handleCountryChange = (country) => {
    setResetPage(true);
    
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter((s) => s !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
    // console.log("Selected countries = ", selectedCountries);
  };

  const handleCompanyChange = (company) => {
    setResetPage(true);
    
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

  // Обробка зміни інтервалу цін
  const handlePriceRangeChange = () => {
    setMinRangePrice(minPrice);
    setMaxRangePrice(maxPrice);
    setMinBufRangePrice(minPrice);
    setMaxBufRangePrice(maxPrice);
  };

  // Обробка зкидання фільтрів
  const handleFilterReset = () => {
    setSelectedShops([]);
    setSelectedCountries([]);
    setSelectedCompanies([]);
    setMinBufRangePrice(null);
    setMaxBufRangePrice(null);
  };

  return (
    <div
      // ref={sidebarRef}
      // className={`w3-sidebar w3-bar-block w3-card ${isFixed ? 'fixed' : ''}`}
      className="w3-sidebar w3-bar-block w3-card"
      style={{
        width: '17%',
        left: 0,
        paddingTop: "70px"
        // ...(isFixed ? { position: 'fixed', top: 0 } : {}),
      }}
    >
      <div className="filter-container">
        <div align="center">
          <h4 className="w3-bar-item main-title">Фільтри</h4>
          <button onClick={handleFilterReset} className="w3-button w3-black" style={{ marginTop: "5px" }}>Очистити фільтри</button>
        </div>

        <div className="price-filter" style={{ marginTop: "15px", paddingBottom: "15px" }}>
          <h5 className="w3-bar-item sub-title" style={{ marginTop: 0, paddingTop: 0 }}>Ціна</h5>
          <div className="custom-wrapper" style={{ paddingBottom: "0px" }}>
            <div className="price-input-container">
              <div className="price-input">
                <div className="price-field">
                  <span>Від</span>
                  <input 
                    type="number" 
                    className="min-input" 
                    value={minPrice}
                    readOnly
                    onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                    style={{ marginLeft: "2px" }}
                  />
                </div>
                <div className="price-field">
                  <span>До</span>
                  <input 
                    type="number" 
                    className="max-input" 
                    value={maxPrice}
                    readOnly
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                    style={{ marginLeft: "7px" }}
                  />
                </div>
              </div>
              <div className="slider-container">
                <div className="price-slider"></div>
              </div>
            </div>

            <div className="range-input">
              <input 
                type="range"
                className="min-range"
                min={minRangePrice}
                max={maxRangePrice}
                value={minPrice}
                onChange={() => {}}
                step="1"
              />
              <input 
                type="range"
                className="max-range"
                min={minRangePrice}
                max={maxRangePrice}
                value={maxPrice}
                onChange={() => {}}
                step="1"
              />
            </div>
            <div style={{ marginLeft: "5px", marginTop: "15px", paddingBottom: "0px" }}>
              <button className="w3-button w3-black" onClick={handlePriceRangeChange}>Застосувати</button>
            </div>
          </div>
        </div>
  
        {Array.isArray(shops) && shops.length > 0 ? (
          <div style={{ paddingTop: "0" }}>
            <h5 className="w3-bar-item sub-title">Магазини</h5>
            <ul className="shop-list" style={{ paddingLeft: "10px" }}>
              {shops.map((shop, index) => (
                <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "4px", paddingTop: "4px" }}>
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedShops.includes(shop)}
                      onChange={() => handleShopChange(shop)}
                    />
                    <span className="checkmark"></span>
                    <span className="label-text">{shop}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          null
        )}
      
        {Array.isArray(countries) && countries.length > 0 ? (
          <div style={{ marginTop: "15px" }}>
            <h5 className="w3-bar-item sub-title">Країни</h5>
            <ul className="shop-list" style={{ paddingLeft: "10px" }}>
              {countries.map((country, index) => (
                <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "4px", paddingTop: "4px" }}>
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country)}
                      onChange={() => handleCountryChange(country)}
                    />
                    <span className="checkmark"></span>
                    <span className="label-text">{country}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          null
        )}
        
        {Array.isArray(companies) && companies.length > 0 ? (
          <div style={{ marginTop: "15px" }}>
            <h5 className="w3-bar-item sub-title">Виробники</h5>
            <ul className="shop-list" style={{ paddingLeft: "10px" }}>
              {companies.map((company, index) => (
                <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "4px", paddingTop: "4px" }}>
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company)}
                      onChange={() => handleCompanyChange(company)}
                    />
                    <span className="checkmark"></span>
                    <span className="label-text">{company}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          null
        )}

        {Object.entries(parameters).map(([param, values]) => (
          <div style={{ marginTop: "15px" }} key={param}>
            <h5 className="w3-bar-item sub-title">{param}</h5>
            {Array.isArray(values) && values.length > 0 ? (
              <ul className="shop-list" style={{ paddingLeft: "10px" }}>
                {values.map((value, index) => (
                  <li key={index} className="w3-bar-item w3-button" style={{ paddingBottom: "4px", paddingTop: "4px" }}>
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedParameters[param] ? selectedParameters[param].includes(value) : false}
                        onChange={() => handleParameterChange(param, value)}
                      />
                      <span className="checkmark"></span>
                      <span className="label-text">{value}</span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

      </div>
    </div>
  );
};
