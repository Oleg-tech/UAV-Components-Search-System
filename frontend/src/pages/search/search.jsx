import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import { MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import { fetchProducts, fetchDownloadComponents } from "./products";
import { getMinRangePrice, getMaxRangePrice } from "./calculatePrice";
import { Product } from "./product";
import { Pagination } from "./pagination";
import { Filter } from "./filters";

import 'w3-css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import "./component-card.css";
import "./add-animation.css";

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

export const Search = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedShops, setSelectedShops] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedParameters, setSelectedParameters] = useState({});
  
  const [searchResult, setSearchResult] = useState([]);

  const [shopList, setShopList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [parametersList, setParametersList] = useState({});

  const [componentsNumber, setComponentsNumber] = useState(0);

  // Фільтр ціни
  const [minRangePrice, setMinRangePrice] = useState(0);
  const [maxRangePrice, setMaxRangePrice] = useState(100000);
  const [minBufRangePrice, setMinBufRangePrice] = useState(0);
  const [maxBufRangePrice, setMaxBufRangePrice] = useState(100000);

  // Сортування
  const [sorting, setSorting] = useState("");

  // Скинути фільтри
  const [resetPage, setResetPage] = useState(false);

  console.log("Here query = ", query);

  const handleDataUpdate = (newData) => {
    console.log("NewData = ", newData);
    console.log(typeof newData);
    let { search_result, shop_list, countries_list, companies_list, parameters_dict } = newData;
    let componentsNumber = newData.count;
    setData(search_result);
    setSearchResult(search_result);
    setShopList(shop_list);
    setCountryList(countries_list);
    setComponentsNumber(componentsNumber);
    setCompaniesList(companies_list);
    setParametersList(parameters_dict);

    let { min_price, max_price } = newData;

    if ( min_price && max_price) {
      setMinRangePrice(
        parseInt(min_price)
      );
      setMaxRangePrice(
        parseInt(max_price)
      );
    } else {
      setMinRangePrice(
        parseInt(getMinRangePrice(search_result))
      );
      setMaxRangePrice(
        parseInt(getMaxRangePrice(search_result))
      );
    }
  };

  const handleSortChange = (event) => {
    const sortOption = event.target.value;

    setResetPage(true);
    setSorting(sortOption);
  };

  // Get data from server
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts(
        query, currentPage, selectedShops, selectedCountries, selectedCompanies, selectedParameters, minBufRangePrice, maxBufRangePrice, sorting, resetPage
      );
      handleDataUpdate(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
      setResetPage(false);
      return data;
    }
  };

  useEffect(() => {
    if (query) {
      fetchData();
    }
  }, [query, currentPage, selectedShops, selectedCountries, selectedCompanies, selectedParameters, minBufRangePrice, maxBufRangePrice, sorting]);

  const fetchComponentsForFile = async () => {
    try {
      const downloadData = await fetchDownloadComponents(
        query, currentPage, selectedShops, selectedCountries, selectedCompanies, minBufRangePrice, maxBufRangePrice, sorting
      );
      return downloadData;
    } catch (err) {
      setError(err);
    } finally {
      // return downloadData;
    }
  };

  const downloadComponents = async () => {
    try {
      const allData = await fetchComponentsForFile();
  
      const headers = ["Назва", "Ціна, грн.", "Зображення", "Сторінка в магазині", "Магазин", "Країна"];
      const data = [headers, ...allData.map(item => [
        item.componentName,
        item.componentPrice,
        item.componentImageURL,
        item.componentExternalURL,
        item.componentShopName,
        item.componentCountry
      ])];
  
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, 'Components');
      XLSX.writeFile(wb, `${query}-components.xlsx`);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (query === "") {
    return (
      <div className="shop">
        <div className="w3-sidebar w3-bar-block w3-card" style={{ width: '17%', left: 0 }}>
          <Filter
            query={query}
            shops={shopList}
            selectedShops={selectedShops}
            setSelectedShops={setSelectedShops}
            countries={countryList}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
            setMinRangePrice={setMinRangePrice}
            setMaxRangePrice={setMaxRangePrice}
            minRangePrice={minRangePrice}
            maxRangePrice={maxRangePrice}
            setMinBufRangePrice={setMinBufRangePrice}
            setMaxBufRangePrice={setMaxBufRangePrice}
            setResetPage={setResetPage}
            companies={companiesList}
            selectedCompanies={selectedCompanies}
            setSelectedCompanies={setSelectedCompanies}
            parameters={parametersList}
            selectedParameters={selectedParameters}
            setSelectedParameters={setSelectedParameters}
          />
        </div>

        <div className="product-info" style={{marginLeft: '17%', marginRight: '1%', paddingTop: "90px"}}>
          <div className="input-group" style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "20px", maxWidth: "700px" }}>
            <div className="form-outline">
              <MDBInput id="search-focus component-search-input" type="search" className="form-control" label="Пошук" name="query"/>
            </div>
            <MDBBtn color="primary" onClick={() => setQuery(document.getElementById("search-focus component-search-input").value)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
            </MDBBtn>
          </div>

          <div>
            <div className="product-count" style={{
              fontSize: '1.5rem',
              color: '#333',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginLeft: '10px',
              paddingTop: '15px',
              float: 'left'
            }}>
            </div>
            <div style={{ float: 'right' }}></div>
            <div style={{ clear: 'both' }}></div>
          </div>

          <div className="products" style={{ 
            paddingLeft: "20px",
            fontSize: "30px",
            lineHeight: "1.5",
            fontWeight: "bold",
            color: "#333" }}
          >
            Введіть комплектуючі для пошуку
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="shop">
      <div className="w3-sidebar w3-bar-block w3-card" style={{ width: '17%', left: 0 }}>
        <Filter
          query={query}
          shops={shopList}
          selectedShops={selectedShops}
          setSelectedShops={setSelectedShops}
          countries={countryList}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          setMinRangePrice={setMinRangePrice}
          setMaxRangePrice={setMaxRangePrice}
          minRangePrice={minRangePrice}
          maxRangePrice={maxRangePrice}
          setMinBufRangePrice={setMinBufRangePrice}
          setMaxBufRangePrice={setMaxBufRangePrice}
          setResetPage={setResetPage}
          companies={companiesList}
          selectedCompanies={selectedCompanies}
          setSelectedCompanies={setSelectedCompanies}
          parameters={parametersList}
          selectedParameters={selectedParameters}
          setSelectedParameters={setSelectedParameters}
        />
      </div>

      <div className="product-info" style={{marginLeft: '17%', marginRight: '1%', paddingTop: "90px"}}>
        <div className="input-group" style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "20px", maxWidth: "700px" }}>
          <div className="form-outline">
            <MDBInput id="search-focus component-search-input" type="search" className="form-control" label="Пошук" name="query"/>
          </div>
          <MDBBtn color="primary" onClick={() => setQuery(document.getElementById("search-focus component-search-input").value)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </MDBBtn>
        </div>

        <div>
          <div className="product-count" style={{
            fontSize: '1.5rem',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginLeft: '10px',
            paddingTop: '15px',
            float: 'left'
          }}>
          </div>
          <div style={{ float: 'right' }}></div>
          <div style={{ clear: 'both' }}></div>
        </div>

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
      </div>
    </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const componentsPerPage = 32;

  return (
    <div className="shop">
      <div className="w3-sidebar w3-bar-block w3-card" style={{ width: '17%', left: 0 }}>
        <Filter
          query={query}
          shops={shopList}
          selectedShops={selectedShops}
          setSelectedShops={setSelectedShops}
          countries={countryList}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          setMinRangePrice={setMinRangePrice}
          setMaxRangePrice={setMaxRangePrice}
          minRangePrice={minRangePrice}
          maxRangePrice={maxRangePrice}
          setMinBufRangePrice={setMinBufRangePrice}
          setMaxBufRangePrice={setMaxBufRangePrice}
          setResetPage={setResetPage}
          companies={companiesList}
          selectedCompanies={selectedCompanies}
          setSelectedCompanies={setSelectedCompanies}
          parameters={parametersList}
          selectedParameters={selectedParameters}
          setSelectedParameters={setSelectedParameters}
        />
      </div>

      <div className="product-info" style={{marginLeft: '17%', marginRight: '1%', paddingTop: "90px"}}>
        <div className="input-group" style={{ paddingTop: "10px", paddingBottom: "10px", paddingLeft: "20px", maxWidth: "700px" }}>
          <div className="form-outline">
            <MDBInput id="search-focus component-search-input" type="search" className="form-control" label="Пошук" name="query"/>
          </div>
          <MDBBtn color="primary" onClick={() => setQuery(document.getElementById("search-focus component-search-input").value)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </MDBBtn>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: "20px"
        }}>
          <div className="product-count" style={{
            fontSize: '1.5rem',
            color: '#333',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            paddingTop: '15px'
          }}>
            Кількість знайдених комплектуючих: {componentsNumber}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={downloadComponents} style={{ border: 'none', background: 'none', marginRight: "50px", marginTop: "25px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
              </svg>
            </button>

            <div>
              Показувати спочатку:
              <select onChange={handleSortChange} className="form-select">
                <option value="most_appropriate">-</option>
                <option value="cheapest">Дешеві</option>
                <option value="expensive">Дорогі</option>
              </select>
            </div>
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

        <div className="products">
          <ProductList search_result={searchResult}/>
        </div>
      </div>

      {componentsNumber / componentsPerPage > 1 && (
        <div style={{ paddingLeft: "17%", display: "flex", alignItems: "center" }}>
          <div>
            <Pagination
              componentsNumber={componentsNumber}
              componentsPerPage={componentsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>

          <div style={{ marginLeft: "auto", paddingBottom: "20px", paddingRight: "55px" }}>
            <Link to="/feedback" className="btn btn-danger">Повідомити про проблему</Link>
          </div>
        </div>
      )}

    </div>
  );
};
