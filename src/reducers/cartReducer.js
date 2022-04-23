
const initialState={
  items:[],
  orderItems:[]
}
export const cartReducer=(state=initialState,action)=>{
  
  switch(action.type){
    case "CART_ADD_ITEM":
      state.items.push(action.payload.cartItem)
      state.orderItems.push(action.payload.orderItem)
      return{...state, items:[...state.items],orderItems:[...state.orderItems] }
    case "CART_REMOVE_ITEM":
      return {...state,items:state.items.filter(item=>item.id!==action.payload),
        orderItems:state. orderItems.filter(item=>item.id!==action.payload)}
    default:
      return state;
    
  }
}