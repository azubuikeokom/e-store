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