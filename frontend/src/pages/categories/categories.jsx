import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { Product } from './product';
import { Filter } from "./filters";
import { Pagination } from "./pagination";

import 'w3-css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "./add-animation.css";

export const fetchComponents = async (category, currentPage, filtered_shops, filtered_countries, filtered_companies, selected_parameters, sorting) => {
    let url = "http://127.0.0.1:8000/components/api/categories";

    if (currentPage) {
        if(url.includes("?")) {
            const shopsQuery = filtered_shops.join(',');
            url += `&page=${currentPage}`;            
        }
        else {
            const shopsQuery = filtered_shops.join(',');
            url += `?page=${currentPage}`;
        }
    }

    if (filtered_shops) {
        if(url.includes("?")) {
            const shopsQuery = filtered_shops.join(',');
            url += `&shops=${shopsQuery}`;            
        }
        else {
            const shopsQuery = filtered_shops.join(',');
            url += `?shops=${shopsQuery}`;
        }
    }

    if (filtered_countries) {
        if(url.includes("?")) {
            const countriesQuery = filtered_countries.join(',');
            url += `&countries=${countriesQuery}`;
        }
        else {
            const countriesQuery = filtered_countries.join(',');
            url += `?countries=${countriesQuery}`;
        }
    }

    if (filtered_companies) {
        if(url.includes("?")) {
            const companiesQuery = filtered_companies.join(',');
            url += `&companies=${companiesQuery}`;
        }
        else {
            const companiesQuery = filtered_companies.join(',');
            url += `?companies=${companiesQuery}`;
        }
    }

    if (sorting) {
        if(url.includes("?")) {
            url += `&sorting=${sorting}`;
        }
        else {
            url += `?sorting=${sorting}`;
        }
    }

    const data = { 
        "category": category,
        "parameters": selected_parameters
    };
  
    try {
        const response = await axios.post(url, data);
        console.log("Data:\n", response.data);

        return response.data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
};

const ProductList = ({ search_result }) => {
    return (
      <div class="container py-2">
        <div class="row">
            {Array.isArray(search_result) && search_result.length > 0 ? (
              search_result.map((product) => <Product key={product.id} data={product} />)
            ) : (
              <p>Немає результатів для введеного запиту</p>
            )}
        </div>
      </div>
    );
};

export const Categories = (props) => {
    const [category, setCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchResult, setSearchResult] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [componentsNumber, setComponentsNumber] = useState(null);
    const [sorting, setSorting] = useState(null);

    const [shopsList, setShopsList] = useState([]);
    const [countriesList, setCountriesList] = useState([]);
    const [companiesList, setCompaniesList] = useState([]);
    const [parametersList, setParametersList] = useState([]);

    const [selectedShops, setSelectedShops] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [selectedParameters, setSelectedParameters] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [resetPage, setResetPage] = useState(false);
    const componentsPerPage = 32;

    const handleDataUpdate = (newData) => {
        console.log("NewData = ", newData);
        let { search_result, category_name, shop_list, countries_list, companies_list, count, parameters_dict } = newData;
        setSearchResult(search_result);
        setCategoryName(category_name);
        setShopsList(shop_list);
        setCountriesList(countries_list);
        setComponentsNumber(count);
        setCompaniesList(companies_list);
        setParametersList(parameters_dict);
    };

    const handleResetFilter = () => {
        setSelectedShops([]);
        setSelectedCountries([]);
        setSelectedCompanies([]);
        setSelectedParameters([]);
        setCurrentPage(1);
    }

    const handleCategoryChange = (newCategory) => {
        handleResetFilter();
        setCategory(newCategory);
    }

    // Get data from server
    const fetchData = async () => {
        setIsLoading(true);
        try {
        const data = await fetchComponents(
            category, currentPage, selectedShops, selectedCountries, selectedCompanies, selectedParameters, sorting
        );
        handleDataUpdate(data);
        } catch (err) {
            console.log("err");
        //   setError(err);
        } finally {
        setIsLoading(false);
        //   setResetPage(false);
        //   return data;
        }
    };

    useEffect(() => {
        if (category) {
            fetchData();
        }
    }, [category, currentPage, selectedShops, selectedCountries, selectedCompanies, selectedParameters, sorting]);

    const handleSortChange = (event) => {
        const sortOption = event.target.value;
    
        setSorting(sortOption);
    };

    if (category === null) {
        return (
            <div className="shop">
                <div className="w3-sidebar w3-bar-block w3-card" style={{ width: '17%', left: 0 }}>
                    <div align="center" style={{ paddingTop: "70px" }}>
                        <h4 className="w3-bar-item main-title">Категорії</h4>
                    </div>

                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Motor")}>
                        Мотори
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Propellers")}>
                        Пропелери
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Turn regulator")}>
                        Регулятори обертання
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Flight controller")}>
                        Контролери польоту
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Stack")}>
                        Стеки
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Battery")}>
                        Акумулятори
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Frame")}>
                        Каркаси
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Camera")}>
                        Камери
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Video transmitter")}>
                        Відеопередавачі
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("VTX")}>
                        Відеосистеми
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Receiver")}>
                        Приймачі
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Antenna")}>
                        Антени
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Control panel")}>
                        Пульти керування
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Glasses")}>
                        Окуляри
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Quadcopter")}>
                        Квадрокоптери
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Hexacopter")}>
                        Гексакоптери
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Octocopter")}>
                        Октокоптери
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px', paddingBottom: '100px' }} onClick={() => handleCategoryChange("Wing")}>
                        Крила
                    </button>
                </div>
        
                <div className="product-info" style={{marginLeft: '17%', marginRight: '1%', paddingTop: "70px"}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: "20px"}}>
                        <div className="product-count" style={{
                            fontSize: '1.5rem',
                            color: '#333',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            paddingTop: '15px'
                        }}>
                            Оберіть категорію
                        </div>
                    </div>
        
                    <div className="products">
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="shop">
                <div className="w3-sidebar w3-bar-block w3-card" style={{ width: '17%', left: 0, paddingTop: "70px" }}>
                    <div align="center">
                        <h4 className="w3-bar-item main-title">Категорії</h4>
                    </div>

                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Motor")}>
                        Мотори
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Propellers")}>
                        Пропелери
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Turn regulator")}>
                        Регулятори обертання
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Flight controller")}>
                        Контролери польоту
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Stack")}>
                        Стеки
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Battery")}>
                        Акумулятори
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Frame")}>
                        Каркаси
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Camera")}>
                        Камери
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Video transmitter")}>
                        Відеопередавачі
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("VTX")}>
                        Відеосистеми
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Receiver")}>
                        Приймачі
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Antenna")}>
                        Антени
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Motor")}>
                        Пульти керування
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Glasses")}>
                        Окуляри
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Quadcopter")}>
                        Квадрокоптери
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Hexacopter")}>
                        Гексакоптери
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Octocopter")}>
                        Октокоптери
                    </button>
                    <button className="w3-bar-item w3-button" style={{ fontSize: '18px', paddingBottom: '100px' }} onClick={() => handleCategoryChange("Wing")}>
                        Крила
                    </button>
                </div>
        
                <div className="product-info" style={{marginLeft: '17%', marginRight: '1%', paddingTop: "90px"}}>
                    <div className="products" style={{ 
                        paddingLeft: "20px",
                        fontSize: "30px",
                        lineHeight: "1.5",
                        fontWeight: "bold",
                        color: "#333",
                        position: "relative" }}
                    >
                        Зачекайте, відбувається пошук
                        <div className="loading-dots">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
        
                    <div className="products">
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="shop">
            <div className="w3-sidebar w3-bar-block w3-card" style={{ width: '17%', left: 0 }}>
                <div align="center" style={{ paddingTop: "70px" }}>
                    <h4 className="w3-bar-item main-title">Категорії</h4>
                </div>

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Motor")}>
                    Мотори
                </button>

                {category === "Motor" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Propellers")}>
                    Пропелери
                </button>

                {category === "Propellers" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Turn regulator")}>
                    Регулятори обертання
                </button>

                {category === "Turn regulator" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Flight controller")}>
                    Контролери польоту
                </button>

                {category === "Flight controller" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Stack")}>
                    Стеки
                </button>

                {category === "Stack" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Battery")}>
                    Акумулятори
                </button>

                {category === "Battery" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Frame")}>
                    Каркаси
                </button>

                {category === "Frame" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Camera")}>
                    Камери
                </button>

                {category === "Camera" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Video transmitter")}>
                    Відеопередавачі
                </button>

                {category === "Video transmitter" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("VTX")}>
                    Відеосистеми
                </button>

                {category === "VTX" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Receiver")}>
                    Приймачі
                </button>

                {category === "Receiver" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Antenna")}>
                    Антени
                </button>

                {category === "Antenna" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Control panel")}>
                    Пульти керування
                </button>

                {category === "Control panel" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Glasses")}>
                    Окуляри
                </button>

                {category === "Glasses" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Quadcopter")}>
                    Квадрокоптери
                </button>

                {category === "Quadcopter" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Hexacopter")}>
                    Гексакоптери
                </button>

                {category === "Hexacopter" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px' }} onClick={() => handleCategoryChange("Octocopter")}>
                    Октокоптери
                </button>

                {category === "Octocopter" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

                <button className="w3-bar-item w3-button" style={{ fontSize: '18px', paddingBottom: '100px' }} onClick={() => handleCategoryChange("Wing")}>
                    Крила
                </button>

                {category === "Wing" ? (
                    <Filter
                        category={category}
                        shops={shopsList}
                        selectedShops={selectedShops}
                        setSelectedShops={setSelectedShops}
                        countries={countriesList}
                        selectedCountries={selectedCountries}
                        setSelectedCountries={setSelectedCountries} 
                        companies={companiesList}
                        selectedCompanies={selectedCompanies} 
                        setSelectedCompanies={setSelectedCompanies}
                        parameters={parametersList}
                        selectedParameters={selectedParameters}
                        setSelectedParameters={setSelectedParameters}
                    />
                ) : null }

            </div>
    
            <div className="product-info" style={{marginLeft: '17%', marginRight: '1%'}}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: "20px"}}>
                    <div className="product-count" style={{
                        fontSize: '1.5rem',
                        color: '#333',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        paddingTop: '15px'
                    }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: "70px" }}>
                            <div>
                                {categoryName} ({componentsNumber})
                            </div>

                            <div>
                                Показувати спочатку:
                                <select onChange={handleSortChange} className="form-select">
                                    <option value="most_appropriate">-</option>
                                    <option value="cheapest">Дешеві</option>
                                    <option value="expensive">Дорогі</option>
                                </select>
                            </div>
                        </div>

                        {componentsNumber / componentsPerPage > 1 && (
                            <Pagination
                                componentsNumber={componentsNumber}
                                componentsPerPage={componentsPerPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        )}

                        <ProductList search_result={searchResult}/>

                        {componentsNumber / componentsPerPage > 1 && (
                            <Pagination
                                componentsNumber={componentsNumber}
                                componentsPerPage={componentsPerPage}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        )}
                    </div>
                </div>
    
                <div className="products">
                </div>
            </div>
        </div>
    );
};
