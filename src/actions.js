//action creators
// export const addToOrder=(item)=>{
//     return{
//         type:"ORDER_ADD_ITEM",
//         payload:item
//     }
// }
export const addItem=(item)=>{
    return {
        type:"CART_ADD_ITEM",
        payload:{
            cartItem:item.product,
            orderItem:item.orderProduct
        }
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
