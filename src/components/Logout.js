// Imports: Dependencies
import React from 'react';
import { Button, StyleSheet,View} from 'react-native';
import { connect } from 'react-redux';
import {setToken} from '../actions/auth';
import logoutAction from './logoutAction';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screen Dimensions

// Screen: Counter
class Logout extends React.Component {

    logout(e){

        e.preventDefault();
        logoutAction(this.props);
    }

    render() {
        return (
            <View style={{
                flex:1,
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'flex-start',
                padding:15
            }}>
                <Icon name={'logout'} size={20} />
                <Button
                onPress={e=>this.logout(e)}
                title="Logout"
                color="#000"
            /></View>
        )
    }
}


// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    // Action
    return {
        setToken: (token) => dispatch(setToken(token)),
    };
};

// Exports
export default connect(null, mapDispatchToProps)(Logout);
