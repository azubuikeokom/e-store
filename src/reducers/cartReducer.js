
const initialState={
  items:[]
}
export const cartReducer=(state=initialState,action)=>{
  
  switch(action.type){
    case "CART_ADD_ITEM":
      state.items.push(action.payload)
      return{...state, items:[...state.items] }
    case "CART_REMOVE_ITEM":
      return {...state,items:state.items.filter(item=>item.id!==action.payload)}
    default:
      return state;
    
  }
}