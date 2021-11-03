// Imports: Dependencies
import React from 'react';
import {Button, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {setToken} from "../../actions/auth";
import {setWorkingOrder} from "../../actions/main";

// Screen Dimensions

// Screen: Counter
class SupplyStockIcon extends React.Component {




    navigate=()=>{
        this.props.navigation.navigate('SupplyCreate',{
            tab:'stock'
        });

    };


    render() {
        return ((this.props.permissions && this.props.permissions.qrcode) ?
            <TouchableOpacity onPress={e=>this.navigate()} style={[styles.capture]}>
                <Text style={{fontSize:20,marginRight:10}}>
                    Supply Create
                </Text>
                <Icon name={'warehouse'}  size={25}/>
            </TouchableOpacity>
                : null
        )
    }
}

const styles = StyleSheet.create({

    capture: {
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        padding:15,
    },
});

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {

    // Redux Store --> Component
    return {
        authToken: state.authReducer.authToken,
        permissions: state.authReducer.permissions,
        workingOrder: state.mainReducer.workingOrder,
    };
};// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    // Action
    return {
        setToken: (logged) => dispatch(setToken(logged)),
        setWorkingOrder: (order) => dispatch(setWorkingOrder(order)),
    };
};

// Exports
export default connect(mapStateToProps,mapDispatchToProps)(SupplyStockIcon);
