import React from 'react';
import {RNCamera} from 'react-native-camera';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {MyText} from '../../components/views/Base';


class Camera extends React.Component {


    static navigationOptions = {
        header: null


    };
    constructor(props) {
        super(props);
        this.orderId = props.navigation?.state?.params?.id ;
        this.buttons = props.navigation?.state?.params?.buttons;
        this.takePicture = props.navigation?.state?.params?.takePicture ? props.navigation.state.params.takePicture.bind(this) : false;
        this.onBarCodeRead = props.navigation?.state?.params?.onBarCodeRead ? props.navigation.state.params.onBarCodeRead.bind(this) : {};
        this.state={
            closeButton:true,
            snap:false,
        };

        this.goBack = this.goBack.bind(this);

    }


    goBack=()=>{
        this.setState({closeButton:true},()=>{
            this.props.navigation.goBack(null);
        });
    };

    onPictureTaken=()=>{
        this.setState({snap:false});
    };

    onBarCodeRead=(data)=>{
        if(this.onBarCodeRead){
            this.onBarCodeRead(data)
        }
    };

    snap=()=>{
        this.setState({snap:true});
        this.takePicture(this);
    };

    render() {
        return(

                <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    onPictureTaken={this.onPictureTaken}
                    onBarCodeRead={this.onBarCodeRead}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.auto}
                >
                    {({ camera, status, recordAudioPermissionStatus }) => {
                        if (status !== 'READY') return <PendingView />;

                        return  this.takePicture && (
                            <View style={{ flex: 1, flexDirection: 'row',justifyContent:'center', alignItems: 'flex-end' }}>
                                {this.state.snap ?<ActivityIndicator style={styles.capture}/> :
                                    <TouchableOpacity onPress={e=>this.snap()} style={styles.capture}>
                                        <MyText style={{ fontSize: 14, color:'#fff' }}> SNAP </MyText>
                                    </TouchableOpacity>
                                }

                            </View>
                        );
                    }}
                </RNCamera>
                {this.state.closeButton ?
                    <TouchableOpacity disabled={!this.state.closeButton} onPress={e=>this.goBack()} style={[styles.close,{position:'absolute', right:10,top:10}]}>
                        <Icon name="close" style={14}/>
                    </TouchableOpacity>
                : <ActivityIndicator/>
                }
                    {this.buttons && this.buttons.map((button,index)=>
                        <TouchableOpacity  key={index} onPress={e=>{this.props.navigation.navigate(button.route,{})}} style={styles[button.type]}><Text>{button.text}</Text></TouchableOpacity>
                    )}

            </View>
        );
    }
}

const PendingView = () => (
    <View
        style={{
            flex: 1,
            backgroundColor: 'lightgreen',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Text>Waiting</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        // justifyContent: 'flex-end',
        // alignItems: 'center',
    },
    capture: {
        borderWidth:1,
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:50,
        height:50,
        backgroundColor:'#fff',
        borderRadius:25,
        marginBottom:50
    },
    close: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 5,
        alignSelf: 'center',
        margin: 20,
    },
    leftDown: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 5,
        alignSelf: 'center',
        margin: 20,
        position:'absolute', left:10,bottom:10
    },

});

export default Camera;
