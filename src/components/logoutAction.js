const logoutAction =(props) =>{
    props.setToken(false);
    props.navigation.navigate('AuthLoading');
}

export default logoutAction;
