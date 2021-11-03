// Imports: Dependencies
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import {MyText} from "../views/Base";
import {get} from "../../api/main";
import {setToken} from "../../actions/auth";
import {setWorkingOrder} from "../../actions/main";
import Pulse from 'react-native-pulse';

// Screen Dimensions

// Screen: Counter
class WorkingIndicator extends React.Component {


    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.checkLogStatus();
        });
    }


    checkLogStatus(){

        const url = 'order/api/order/check-log?expand=workflowActive';
        get(url, this.props).then(result=>{
            result = result[0] ? result[0] : result;
            if(result && result.order_id ){
                if(result.workflowActive){
                    result.workflow = result.workflowActive;
                    delete  result.workflowActive;
                }

                this.props.setWorkingOrder(result);
            }else{
                this.props.setWorkingOrder(false);

            }

        });
    }
    navigate=()=>{
        if(this.props.workingOrder){
            this.props.navigation.navigate('OrderItem',{
                item:this.props.workingOrder,
                id:this.props.workingOrder.order_id,
            })
        }else{
            this.props.navigation.navigate('Main')

        }

    };

    render() {

        return (
            <TouchableOpacity onPress={e=>this.navigate()} style={[styles.capture,{backgroundColor: this.props.workingOrder ?   'red' : 'green' }]}>
                <MyText style={{ fontSize: 14, color:'#fff' }}/>{this.props.workingOrder&&<Pulse color='orange' numPulses={3} diameter={100} speed={20} duration={2000} />}
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({

    capture: {
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:20,
        height:20,
        backgroundColor:'#fff',
        borderRadius:10,
        marginRight:20,

    },
});

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {

    // Redux Store --> Component
    return {
        authToken: state.authReducer.authToken,
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
export default connect(mapStateToProps,mapDispatchToProps)(WorkingIndicator);
