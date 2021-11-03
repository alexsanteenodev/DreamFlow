// Imports: Dependencies
import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import {Icon} from 'react-native-elements';

// Screen Dimensions

// Screen: Counter
class CartIcon extends React.Component {



    render() {

        return (
            (Object.keys(this.props.supplyItems).length>0 || Object.keys(this.props.warehouseItems).length>0) ?
            <TouchableOpacity style={{marginRight:50}} onPress={() => this.props.navigation.navigate('Cart')}>
                <Text style={{fontSize:20 ,marginRight:10}}>
                    Cart
                </Text>
                <Icon name='shopping-cart' type={'font-awesome'} size={40} style={{paddingHorizontal: 10}}/>
            </TouchableOpacity>
                :false
        )
    }
}



// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {

    // Redux Store --> Component
    return {
        supplyItems: state.cartReducer.supplyItems,
        warehouseItems: state.cartReducer.warehouseItems,
        orderId: state.cartReducer.orderId,
    };
};

// Exports
export default connect(mapStateToProps)(CartIcon);
