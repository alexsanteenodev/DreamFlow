import {Modal, TextInput, TouchableHighlight, View} from 'react-native';
import styles from '../screens/materials-required/styles';
import {Icon} from 'react-native-elements';
import {MyText} from './views/Base';
import React from 'react';

import { ORIENTATIONS } from '@env'
const SUPPORTED_ORIENTATIONS = ORIENTATIONS ? ORIENTATIONS.split(',') : [];

class AddToCartModal extends React.Component{

    state={
        cartQuantity : this.props.initQuantity ? this.props.initQuantity : '1',
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.initQuantity && prevProps.initQuantity !== this.props.initQuantity ){
            this.setState({
                cartQuantity: this.props.initQuantity.toString()
            })
        }
    }


    handleQuantityChange = (cartQuantity) => {
        if (/^\d+$/.test(cartQuantity) || cartQuantity==='') {
            this.setState({
                cartQuantity: cartQuantity
            });
        }
    };

    quantityChange = (e,type) => {
        e.preventDefault();
        let oldQuantity = this.state.cartQuantity ?  parseInt(this.state.cartQuantity) : 0;
        let cartQuantity  = (type==='plus') ?  oldQuantity+1 : (oldQuantity>1 ? oldQuantity-1 : 1)  ;
        this.setState({cartQuantity:cartQuantity.toString()})
    };

    render() {
        return (
            <Modal
                transparent={false}
                animationType="fade"
                visible={this.props.addToCartModal}
                supportedOrientations={SUPPORTED_ORIENTATIONS}
            ><View
                    style={{flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop:20,
                        backgroundColor: '#DCDCDC',}}
                >{this.props.title ?
                        <View style={{
                            flexDirection:"row",
                            justifyContent:"space-between",
                        }}><MyText>{this.props.title}</MyText></View> : null
                    }<View style={styles.mainInputContainer}>
                        <TouchableHighlight underlayColor={'#fff'} onPress={e=>this.quantityChange(e,'minus')}
                                            style={styles.quantityIconsTouch}
                        >
                            <Icon  iconStyle={styles.quantityIcons}  name={'minus-circle'} type={'font-awesome'}/>
                        </TouchableHighlight>
                        <View style={[styles.inputContainer,styles.quantityContainer]}>
                            <TextInput style={[styles.bigInput]}
                                       placeholder={'Quantity'}
                                       keyboardType={'numeric'}
                                       underlineColorAndroid='transparent'
                                       value={this.state.cartQuantity.toString()}
                                       onChangeText={(cartQuantity) => this.handleQuantityChange(cartQuantity)}/>
                        </View>
                        <TouchableHighlight underlayColor={'#fff'} onPress={e=>this.quantityChange(e,'plus')}
                                            style={styles.quantityIconsTouch}
                        >
                            <Icon  iconStyle={styles.quantityIcons}  name={'plus-circle'} type={'font-awesome'}/>
                        </TouchableHighlight>
                    </View>
                    <View style={{
                        flexDirection:"row",
                        justifyContent:"space-between",
                    }}>
                        <TouchableHighlight underlayColor={'#fff'}  style={[styles.buttonContainer, styles.loginButton]} onPress={(e) => this.props.addToCart(e, this.state.cartQuantity)}>
                            <MyText style={styles.loginText}>{this.props.confirmText ? this.props.confirmText : 'Add to cart'}</MyText>
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor={'#fff'}  style={[styles.buttonContainer, styles.cancelButton]} onPress={() => {this.props.setState({addToCartModal:false,cartProduct:false})}}>
                            <MyText style={styles.loginText}>Cancel</MyText>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default AddToCartModal;
