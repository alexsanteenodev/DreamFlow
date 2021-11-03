// Imports: Dependencies
import React from 'react';
import {Button, StyleSheet, TouchableOpacity,Text} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import {setToken} from "../../actions/auth";
import {setWorkingOrder} from "../../actions/main";

// Screen Dimensions

// Screen: Counter
class QrCodeIcon extends React.Component {




    navigate=()=>{
        this.props.navigation.navigate('QrCodeScanner',{
            onBarCodeRead:this.onBarCodeRead.bind(this),
            buttons:[{
                route:'SupplyCreate',
                type:'leftDown',
                text:'Supply'
            }]

        })


    };

    onBarCodeRead=(data)=>{
        if(data){
            this.props.navigation.navigate('SupplyCreate', {
                'qrcode': data
            })
        }
    };

    render() {
        return ((this.props.permissions && this.props.permissions.qrcode) ?
            <TouchableOpacity onPress={e=>this.navigate()} style={[styles.capture]}>
                <Text style={{fontSize:20,marginRight:10}}>
                    Qr Code
                </Text>
                <Icon name={'qrcode'} size={25}/>
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
        padding:15
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
export default connect(mapStateToProps,mapDispatchToProps)(QrCodeIcon);
