//action creators
export const addItem=(item)=>{
    return {
        type:"CART_ADD_ITEM",
        payload:item
    }
}
export const removeItem=(id)=>{
    return{
        type:"CART_REMOVE_ITEM",
        payload:id
    }
}
export const fetchData=(data)=>{
    return{
        type:"FETCH_SUCCESSFUL",
        payload:data
    }
}
export const setCurrency=(symbol)=>{
    return{
        type:"SET_CURRENCY",
        payload:symbol
    }
}
