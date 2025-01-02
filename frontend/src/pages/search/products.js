import axios from 'axios';

export const fetchProducts = async (query, page, filtered_shops, filtered_countries, filtered_companies, selected_parameters, min_range_price, max_range_price, sorting, reset_page) => {
    console.log("Query = ", query);

    if (reset_page) {
      page = 1;
    }

    let url;
    if (filtered_shops) {
        const shopsQuery = filtered_shops.join(',');
        url = `http://127.0.0.1:8000/components/api/search/?page=${page}&shops=${shopsQuery}`;
    } else {
        url = `http://127.0.0.1:8000/components/api/search/?page=${page}`;
    }

    if (filtered_countries) {
      const countriesQuery = filtered_countries.join(',');
      url += `&countries=${countriesQuery}`;
      // console.log("countries = ", countriesQuery);
    }

    if (filtered_companies) {
      const companiesQuery = filtered_companies.join(',');
      url += `&companies=${companiesQuery}`;
      console.log("companies = ", companiesQuery);
    }

    if (min_range_price && max_range_price) {
      url += `&min_price=${min_range_price}&max_price=${max_range_price}`;
    }
    if (sorting) {
      url += `&sorting=${sorting}`;
    }

    const data = { 
      "query": query,
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

export const fetchDownloadComponents = async (query, filtered_shops, filtered_countries, min_range_price, max_range_price, sorting) => {
  let url = "http://127.0.0.1:8000/components/api/search/download";

  let has_parameters = false;

  // if (Array.isArray(filtered_shops) && filtered_shops.length > 0) {
  //     const shopsQuery = filtered_shops.join(',');
  //     url = `http://127.0.0.1:8000/components/api/search/download?shops=${shopsQuery}`;
  //     has_parameters = true;
  // } else {
  //     url = `http://127.0.0.1:8000/components/api/search/download?`;
  // }

  // if (filtered_countries) {
  //   const countriesQuery = filtered_countries.join(',');
  //   if (has_parameters === true) {
  //     url += `&countries=${countriesQuery}`;
  //     has_parameters = true;
  //   }
  //   else {
  //     url += `countries=${countriesQuery}`;
  //   }
  // }

  // if (min_range_price && max_range_price) {
  //   if (has_parameters === true) {
  //     url += `&min_price=${min_range_price}&max_price=${max_range_price}`;
  //   }
  //   else {
  //     url += `min_price=${min_range_price}&max_price=${max_range_price}`;
  //     has_parameters = true;
  //   }
  // }

  // if (sorting) {
  //   if (has_parameters === true) {
  //     url += `&sorting=${sorting}`;
  //   }
  //   else {
  //     url += `sorting=${sorting}`;
  //     has_parameters = true;
  //   }
  // }

  const data = { "query": query };

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};
