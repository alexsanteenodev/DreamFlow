import React from 'react';
import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import { Icon } from 'react-native-elements';
import QRScannerView from '../../components/modules/QrScannerView';

export default class DefaultScreen extends React.Component {

    state={
      torch:false,
        qrcode:false
    };
    constructor(props) {
        super(props);

        this.onBarCodeRead = props.navigation?.state?.params?.onBarCodeRead ? this.props.navigation.state.params.onBarCodeRead.bind(this) : {};
        this.buttons =props.navigation?.state?.params?.buttons;

    }

    renderTitleBar = () => <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
                            {this.buttons && this.buttons.map((button,index)=>
                                <TouchableOpacity  key={index} onPress={e=>{
                                    this.setState({torch:false,qrcode:false},()=>{
                                        this.props.navigation.navigate(button.route,{})
                                    });
                                   }}
                                                   style={{
                                                       backgroundColor: '#fff',
                                                        borderRadius: 5,
                                                        padding: 5,
                                                        paddingHorizontal: 5,
                                                   }}
                                ><Text >{button.text}</Text></TouchableOpacity>
                            )}
                            <Icon name={'flashlight'} underlayColor ={'transparent'} type={'entypo'} color={'#fff'} onPress={()=>{this.setState({torch:!this.state.torch})}}/>
                        </View>;

    renderMenu = () => this.state.qrcode && <TouchableOpacity
        onPress={()=>{
            if(this.onBarCodeRead){
                let qrcode = this.state.qrcode;
                this.setState({torch:false,qrcode:false},()=>{

                    this.onBarCodeRead(qrcode);
                });

            }
        }}
        style={{
        marginBottom:50, backgroundColor:'#fff',width:'30%',alignSelf:'center'
    }}><Text style={{color:'#000',textAlign:'center',padding:16}}>{this.state.qrcode}</Text></TouchableOpacity>

    barcodeReceived = (event) => {
        if(event.data){
            this.setState({
                qrcode:event.data
            })
        }
    };

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <QRScannerView
                    onScanResult={ this.barcodeReceived }
                    renderHeaderView={ this.renderTitleBar }
                    renderFooterView={ this.renderMenu }
                    scanBarAnimateReverse={ true }
                    scanInterval = {1500}
                    torchOn = {this.state.torch}
                    hintText={''}
                    vibrate={true}
                />
            </SafeAreaView>
        )
    }
}
