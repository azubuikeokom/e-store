
export const categoryReducer=(state={allCategories:{},loading:true},action)=>{
    switch(action.type){
        case "FETCH_SUCCESSFUL":
            return {...state,allCategories:action.payload,loading:false}
        default:
            return state;
    }
}