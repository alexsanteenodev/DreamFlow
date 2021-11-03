import React from 'react';
import {Image, Modal, TouchableOpacity, View,Text} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Icon} from 'react-native-elements';
import { ORIENTATIONS } from '@env'
const SUPPORTED_ORIENTATIONS = ORIENTATIONS ? ORIENTATIONS.split(',') : [];
class ImageModal extends React.Component {

    state={
        index:this.props.imageIndex
    };


    move=(plus)=>{
        let index = this.state.index;


        this.setState(prevState => {
            return {index:  plus  ? prevState.index + 1 : prevState.index - 1}
        })
    };

    render(){
        return <Modal
            visible={this.props.visible}
            transparent={true}
            animationType="fade"
            supportedOrientations={SUPPORTED_ORIENTATIONS}
            onRequestClose={() => this.props.setState({ modalVisible: false })}
        >
            <ImageViewer
                imageUrls={this.props.images}
                index={this.state.index}
                renderArrowLeft={()=>{
                    return (this.state.index>0) && <Icon
                        color={'#fff'}
                        size={40}
                        type={'antdesign'}
                        name={'arrowleft'}
                        iconStyle={{position:'absolute',
                            top:0,
                            left:50,backgroundColor:'#000'}}
                        onPress={()=>{this.move(false)}
                        }
                    />
                }}
                renderArrowRight={()=>{
                    return  ((this.state.index+1) < this.props.images.length) && <Icon
                        color={'#fff'}
                        size={40}
                        type={'antdesign'}
                        name={'arrowright'}
                        iconStyle={{position:'absolute',
                            top:0,
                            right:50,backgroundColor:'#000'}}
                        onPress={()=>{this.move(true)}
                        }
                    />
                }}
                renderImage={(props)=>{
                    return  <View style={{flex:1}}>
                        <Image {...props} />
                        <TouchableOpacity
                            style={{
                                position:'absolute',
                                top:10,
                                right:50
                                // alignSelf:'flex-end',
                                // marginRight:40,
                                // marginTop:20,
                            }}
                            onPress={() => {
                                this.props.setState({ modalVisible: false });
                            }}>
                            <Icon color={'#fff'} style={{fontWeight:'bold'}}
                                  iconStyle={{backgroundColor:'#000'}}
                                  size={40} name={'close'}/>
                        </TouchableOpacity>
                    </View>
                }}

            />
        </Modal>
    }
}

export default ImageModal;
