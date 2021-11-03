import React from 'react';
import {connect} from 'react-redux';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import {setToken} from '../actions/auth';
import ImagesList from './ImagesList';
import {normalizeFont} from '../functions/frontend';

class ImagesLoader extends React.Component {

    state={
        images:[],
        loading:false,
        checkedExist:false,
        showSubmit:false,
    };

    constructor(props) {
        super(props);
        this.orderId = this.props.navigation.state.params.id ? this.props.navigation.state.params.id : this.props.id;
        this.openPicker = this.openPicker.bind(this);
        this.openCamera = this.openCamera.bind(this);

    }


    openPicker=(e)=>{

        this.child.setState({loading:true});
        ImagePicker.openPicker({
            multiple: true,
            maxFiles: 15,
            writeTempFile:false,
            includeBase64:true,
        }).then(images => {


            let stateImages = [];
            images.forEach((item)=>{
                let image = `data:${item.mime};base64,${item.data}`;
                let imageItem ={
                    uri: image,
                    mime: item.mime,
                    filename: item.filename,
                };
                stateImages.push(imageItem);


            });
            this.child.setState({
                images: this.child.state.images.concat(stateImages)
            },()=>{
                this.child.setState({loading:false});

                this.child.checkChecked();
            })
        }).catch(error=>{
            console.log('error',error);
            this.child.setState({loading:false})
        });
    };
    openCamera=(e)=>{
        this.props.navigation.navigate('Camera',{
            takePicture:this.takePicture.bind(this)
        })
    };

    takePicture = async(self) => {
        if (self.camera) {
            this.setState({loading:true});
            const options = { quality: 0.5, base64: true };
            const data = await self.camera.takePictureAsync(options);
            let image = `data:image/jpeg;base64,${data.base64}`;
            let imageItem ={
                uri: image,
                filename: data.filename,
                mime: 'image/jpeg',
            };
            this.child.setState(state => {
                const images = [...state.images, imageItem];
                return {
                    images
                };
            },()=>{
                this.child.setState({loading:false});
                this.child.checkChecked();
            });
        }
    };


    render() {

        return(
            <View style={styles.container}>
                <View  style={{
                    flex:1/10,
                    flexDirection:'row',
                    justifyContent:'space-around',
                    marginTop:5,
                    marginBottom:5,
                    borderBottomWidth:2,
                    borderColor:'#a1a1a1'
                }}>
                    <TouchableOpacity
                        onPress={e=>this.openPicker()}
                    >
                        <Icon
                            name='image'
                            type={'font-awesome'}
                            size={normalizeFont(30)}
                            style={{paddingHorizontal: 10}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={e=>this.openCamera()}
                    >
                        <Icon
                            name='camera'
                            type={'font-awesome'}
                            size={normalizeFont(30)}
                            style={{paddingHorizontal: 10}}
                        />
                    </TouchableOpacity>
                </View>
                <ImagesList
                    state={this.state}
                    type={this.props.type}
                    fileType={this.props.fileType}
                    navigation={this.props.navigation}
                    id={this.props.id}
                    childRef={ref => (this.child = ref)}
                    onSubmit={this.props.onSubmit}
                    saveUrl={this.props.saveUrl}
                    url={this.props.url}
                />
            </View>
        );

    }




}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    iconItem:{
        padding:5,
        borderRadius:10,
    },
    deleteButton:{
        padding:10,
        backgroundColor: '#ec4a2b',
        margin:3,
        borderRadius: 5

    },
    submitButton:{
        padding:10,
        backgroundColor: '#00b5ec',
        margin:3,
        borderRadius: 5

    },
});


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
        setToken: (logged) => dispatch(setToken(logged)),
    };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(ImagesLoader);
