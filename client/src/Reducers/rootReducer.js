const initState = {
    loggedin: false
}
const rootReducer = (state = initState , action) =>{
    if(action.type === 'LOGIN')
    {
        return{
            ...state,
            loggedin: action.loggedin
        }
    }
    return state;
}

export default rootReducer;