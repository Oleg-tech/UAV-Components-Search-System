import React, { createContext } from "react";

export const ShopContext = createContext(null);

export const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({})

    return <ShopContext.Provider>
        {props.children}
    </ShopContext.Provider>;    
};
