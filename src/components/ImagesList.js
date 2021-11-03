import React from 'react';
import {connect} from 'react-redux';
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Text,
    FlatList,
    Dimensions,
    Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {setToken} from '../actions/auth';
import {get, postForm} from '../api/main';
import ImageModal from './ImageModal';
const win = Dimensions.get('window');


class ImagesList extends React.Component {


    constructor(props) {
        super(props);

        this.orderId = this.props.navigation.state.params.id? this.props.navigation.state.params.id : this.props.id;

        this.state={
            images:[],
            loading:false,
            checkedExist:false,
            showSketch:false,
            showSubmit:false,
            modalImages:[],
            modalVisible:[],
            modalImagesIndex:0,
        };
        this.numColumns = 3
    }

    componentDidMount() {
        this.getImages();
        const { childRef } = this.props;
        childRef(this);
    }

    componentWillUnmount() {
        const { childRef } = this.props;
        childRef(undefined);
    }



    openImage=(image)=>{

        let images = [...this.state.images];
        let index = images.indexOf(image);
        images  = images.map(function (image) {
            image.url = image.uri;
            return image;
        });
        this.setState({
            modalImages:images,
            modalVisible:true,
            modalImagesIndex:index,

        })

        // ImagePicker.openCropper({
        //     path:image.uri ? image.uri : image,
        //     cropperCancelText: '',
        //     cropperChooseText: 'RETURN'
        // }).then(image => {
        //     console.log(image);
        // }).catch(err=>{
        //     console.log('err',err);
        // });
    };

    deleteChecked=()=>{
        let images = [...this.state.images];
        images = images.filter((item)=>{
            return !item.checked;
        });
        this.setState({images:images},()=>{
            this.checkChecked();
        });
    };

    onSubmit=()=>{

        let data = new FormData();
        let instanceType = 'files';

        this.state.images.forEach((item, i) => {
            if(!item.id){
                data.append(instanceType+"[]", {
                    uri: item.uri,
                    type: "image/jpeg",
                    name: item.filename || `image${i}.jpg`,
                });
            }

        });
        data.append("type",this.props.type);
        data.append("instanceType",instanceType);

        if(this.props.onSubmit){
            return this.props.onSubmit({images:data});
        }
        const url = this.props.saveUrl ||  'order/api/order/upload-images?orderId='+this.orderId;
        this.setState({ loading: true });

        postForm(url,data,false,this.props).then(result=>{

            this.setState({ loading: false });
            if(result.error || result.message){
                Alert.alert(
                    'Error',
                    JSON.stringify(result.error || result.message),
                    {cancelable: false},
                );
                return false;
            }

            if(result.success){
                Alert.alert(
                    'Success',
                    result.success,
                    {cancelable: false},
                );
                this.setState({images:[]});
                this.getImages();
            }
        })

    };


    getImages=()=>{
        let type = this.props.type||'drawings';
        if(!this.orderId && !this.props.url )
            return;

        const url = this.props.url || 'order/api/order/order-images?orderId='+this.orderId+'&imageType='+type;
        this.setState({loading:true});
        get(url,  this.props).then(result=>{
            if(result.error || result.message){
                this.setState({loading:false});
                return false;
            }

            this.setState({
                images: this.state.images.concat(result)
            },()=>{
                this.setState({loading:false})
            });
            this.checkChecked();
        });
    };
    deleteImage=(image)=>{
        const url = 'order/api/order/delete-file';
        this.setState({ loading: true });

        postForm(url,{"key":image.id,"fileType" :this.props.fileType}, true,this.props).then(result=>{

            if(result.error || result.message){
                Alert.alert(
                    'Error',
                    JSON.stringify(result.error || result.message),
                    {cancelable: false},
                );
                return false;
            }
            this.setState({ loading: false });


            let array = [...this.state.images]; // make a separate copy of the array
            let index = array.indexOf(image);
            if (index !== -1) {
                array.splice(index, 1);
                this.setState({images: array});
            }


        })
    };


    checkImage=(image)=>{
        if(image.id){

            Alert.alert(
                'Image delete',
                'Are you sure want to delete the image from the server?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {text: 'OK', onPress: () => this.deleteImage(image)},
                ],
                {cancelable: false},
            );
        }else{
            image.checked= !image.checked;
            this.forceUpdate();
            this.checkChecked();
        }
    };


    checkChecked=()=>{
        let checked = false;
        let showSubmit = false;
        for(let i in this.state.images){
            if(this.state.images[i].checked){
                checked=true;
            }
            if(!this.state.images[i].id){
                showSubmit=true;
            }
        }
        this.setState({checkedExist:checked,showSubmit:showSubmit})


    };



    render() {

        return(

            <View style={styles.container}>
                <ImageModal
                    images={this.state.modalImages}
                    imageIndex={this.state.modalImagesIndex || 0}
                    visible={this.state.modalVisible}
                    setState={this.setState.bind(this)}
                />
                {this.state.checkedExist &&
                    <View style={{alignItems:'center'}}>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={()=>this.deleteChecked()}
                        >
                        <Text style={{color:'#fff'}}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                }
                <View style={{
                    flex:1,
                }}>
                    <View

                        style={{
                            flex: 1,
                            // flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                        }}

                    ><FlatList
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                                height: '100%',
                                width: '100%'
                            }}
                            keyExtractor={(_, index) => index.toString()}
                            numColumns={this.numColumns}
                            data={this.state.images}
                            renderItem={this.props.renderItem ? this.props.renderItem : this.renderItem}
                            ListEmptyComponent={<View style={{alignItems:'center'}}><Text>No data found</Text></View>}
                            ListFooterComponent={this._renderFooter}
                        />
                    </View>
                </View>
            </View>
        );

    }

    renderItem = (item) => {
        let image = item.item;
        return (
            <View style={{
                flex:1/this.numColumns,
                alignItems: 'center',
            }}>
                <Image
                    style={{
                        width:win.width/this.numColumns-6,
                        height:win.width/this.numColumns-10,
                        backgroundColor:'#d2d2d2',
                        margin:3,
                        flex:1,
                        // resizeMode: 'contain',
                        // marginVertical: 12,
                    }}

                    resizeMode={'contain'}
                    source={{uri: image.uri ? image.uri : image}}


                />
                <TouchableOpacity
                    style={{position:'absolute',
                        top: 3,
                        left: 5
                    }}
                    onPress={()=>this.openImage(image)}
                ><Icon name={'zoom-in'} size={35}
                         style={styles.iconItem}
                         color={'#303030'}
                />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{position:'absolute',
                        top: 3,
                        right: 5
                    }}
                    onPress={()=>this.checkImage(image)}
                ><Icon name={(image.id) ? 'delete' : (image.checked ? 'check-box': 'check-box-outline-blank')  } size={35}
                      style={styles.iconItem}
                      color={'#303030'} />
                </TouchableOpacity>
            </View>
        );
    };
    _renderFooter = () => {
        return (
            this.state.loading?
            <View
                style={{
                    position: 'relative',
                    paddingVertical: 20,
                    // borderTopWidth: 1,
                    marginTop: 10,
                    marginBottom: 10,
                    alignItems:'center'
                }}
            >
                <Text>Loading assets </Text><ActivityIndicator animating size="large" />
            </View>
                : ((this.state.images.length&& this.state.showSubmit) ?
                <View style={{alignItems:'center',marginBottom:10}}>
                    <TouchableOpacity style={styles.submitButton}
                                      onPress={e=>this.onSubmit()}
                    >
                        <Text style={{color:'#fff'}}>Submit</Text>
                    </TouchableOpacity>
                </View> : null)
        );
    };
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
export default connect(mapStateToProps, mapDispatchToProps)(ImagesList);
