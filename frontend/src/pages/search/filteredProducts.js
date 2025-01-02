import axios from 'axios';

export const fetchFilteredProducts = async (query, page, filtered_shops) => {
    console.log("Query = ", query);

    let url;
    if (filtered_shops.length > 0) {
        const shopsQuery = filtered_shops.join(',');
        url = `http://127.0.0.1:8000/components/api/search/?page=${page}&shops=${shopsQuery}`;
    } else {
        url = `http://127.0.0.1:8000/components/api/search/?page=${page}`;
    }
    // console.log("URL = ", url);
    const data = { "query": query };
  
    try {
      const response = await axios.post(url, data);

      console.log("Data:\n", response.data);

      return response.data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
};

