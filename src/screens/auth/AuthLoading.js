import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    View,
} from 'react-native';
import { connect } from 'react-redux';
import {setLogged, setToken} from '../../actions/auth';
import {sendDeviceToken} from '../../api/main';
import AsyncStorage from '@react-native-community/async-storage';

class AuthLoadingScreen extends React.Component {
    componentDidMount() {

        this._bootstrapAsync();




    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {

        if(this.props.authToken){
            let fcmToken = await AsyncStorage.getItem('fcmToken');
            await sendDeviceToken(fcmToken,this.props)
        }


        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(this.props.authToken ? 'App' : 'Auth');
    };

    // Render any loading content that you like here
    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {

    // Redux Store --> Component
    return {
        authToken: state.authReducer.authToken,
    };
};

// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    // Action
    return {
        setToken: (token) => dispatch(setToken(token)),
    };
};

// Exports
// export default AuthLoadingScreen;
export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);
