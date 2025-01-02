export const getMinRangePrice = (components) => {
    let minPrice = Number.MAX_VALUE;
  
    for (const product of components) {
        if (product.componentPrice.includes(' - ')) {
            const [min, max] = product.componentPrice.split(' - ').map(price => parseFloat(price));
            minPrice = Math.min(minPrice, min);
        } else {
            minPrice = Math.min(minPrice, parseFloat(product.componentPrice));
        }
    }
  
    console.log("Min Price:", minPrice);
    return minPrice;
};

export const getMaxRangePrice = (components) => {
    let maxPrice = 0;
  
    for (const product of components) {
        if (product.componentPrice.includes(' - ')) {
            const [min, max] = product.componentPrice.split(' - ').map(price => parseFloat(price));
            maxPrice = Math.max(maxPrice, max);
        } else {
            maxPrice = Math.max(maxPrice, parseFloat(product.componentPrice));
        }
    }
  
    console.log("Max Price:", maxPrice);
    return maxPrice;
};