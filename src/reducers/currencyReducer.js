export const currencyReducer=(state={currency:"$"},action)=>{
    switch(action.type){
        case "SET_CURRENCY":
            return {...state,currency:action.payload}
        default:
            return state;
    }
}