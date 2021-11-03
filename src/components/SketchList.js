import React from 'react';
import {connect} from 'react-redux';
import {View, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Text, FlatList, Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import {setToken} from '../actions/auth';
import {MyText} from './views/Base';
import Sketch from './Sketch';
import ImagesList from './ImagesList';
const win = Dimensions.get('window');

class SketchList extends React.Component {

    state={
        images:[],
        loading:false,
        checkedExist:false,
        showSketch:false,
        showSubmit:false,

    };

    constructor(props) {
        super(props);
        this.orderId = this.props.navigation.state.params.id;
        this.saveSketch = this.saveSketch.bind(this);
    }


    addSketch=(e)=>{
        this.setState({showSketch:true});
    };


    saveSketch = (data) => {
        let image = `data:image/jpeg;base64,${data}`;

        let imageItem ={
            uri: image,
            mime: 'image/jpeg'
        };
        this.child.setState(state => {
            const images = [...state.images, imageItem];
            return {
                images
            };
        },()=>{
            this.setState({loading:false, showSketch:false});
            this.child.checkChecked();
        });
    };

    closeSketch=()=>{
        this.setState({loading:false, showSketch:false});
    };

    render() {
        return(
            <>
                {this.state.showSketch &&
                <Sketch
                    saveSketch={this.saveSketch.bind(this)}
                    closeSketch={this.closeSketch.bind(this)}
                />
                }
            <View style={[styles.container,{
                width:this.state.showSketch ? 0: 'auto',
                height:this.state.showSketch ? 0: 'auto',
                flex:this.state.showSketch ? 0: 1,

            }]}>
                <View  style={{
                    flex: 1/10,
                    flexDirection:'row',
                    justifyContent:'space-around',
                    marginTop:10,
                    borderBottomWidth:2,
                    borderColor:'#a1a1a1',
                }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor:'#3176ff',
                            flex:1/3,
                            margin:3,
                            alignItems:'center',
                            justifyContent:'center',
                            borderRadius:5
                        }}
                        onPress={e=>this.addSketch()}
                    ><MyText style={{color:'#fff'}}>Add sketch</MyText></TouchableOpacity>
                </View>
                <ImagesList
                    state={this.state}
                    type={this.props.type}
                    fileType={this.props.fileType}
                    navigation={this.props.navigation}
                    childRef={ref => (this.child = ref)}
                    id={this.props.id}
                />
            </View>
            </>
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
export default connect(mapStateToProps, mapDispatchToProps)(SketchList);
