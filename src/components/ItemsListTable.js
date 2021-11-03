import React from 'react';
import {setToken} from '../actions/auth';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';
import {
    View,
    StyleSheet,
    Alert,
    SafeAreaView,
    ScrollView,
    Switch,
    TouchableOpacity,
    Text,
    Dimensions, ActivityIndicator,
} from 'react-native';
import {get, postForm} from '../api/main';
import {getLabel, normalizeFont} from '../functions/frontend';
import commonStyles from '../screens/styles';
import Moment from 'moment';

import {Table, Row, TableWrapper, Cell} from 'react-native-table-component';
import ImagePicker from "react-native-image-crop-picker";
import ImageModal from './ImageModal';
const window = Dimensions.get('window');

class ItemsList extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            items:[],
            loading: false,
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            modalImages:[],
            modalVisible:[],
            modalImagesIndex:0,
        };

    }



    componentDidMount() {

        this.makeRemoteRequest();

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.makeRemoteRequest();
        });
    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();
    }

    makeRemoteRequest = () => {
        const { page, seed } = this.state;
        const url = this.props.url;
        this.setState({ loading: true });

        get(url, this.props).then(result=>{

            if(result.error || result.message){
                Alert.alert(
                    'Error',
                    result.error || result.message,
                    {cancelable: false},
                );
                return false;
            }
            this.setState({
                items: page === 1 ? result : [...this.state.items, ...result],
                error: result.error || null,
                loading: false,
                refreshing: false
            })
        })
    };


    openImage=(image,images)=>{

        images =images ? images : [...this.state.images];
        let index = images.indexOf(image);
        images  = images.map(function (image) {
            let newImage = {};
            newImage.url = image.uri ? image.uri : image;
            return newImage;
        });
        this.setState({
            modalImages:images,
            modalVisible:true,
            modalImagesIndex:index,

        });

    };

    updateField=(id,name,value)=>{

        let url  =this.props.updateUrl +id;

        postForm(url,{[name]:value},  true,this.props)
            .then(result=>{
                if(result.error || result.message){
                    Alert.alert(
                        'Error',
                        result.error || result.message,
                        {cancelable: false},
                    );
                    return false;
                }


                if(result.id){
                    this.item = result;
                    this.id = result.id;
                    // Alert.alert(
                    //     'Success',
                    //     'Saved!',
                    //     {cancelable: false},
                    // );
                }
                this.setState({ loading: false });
            })
            .catch(err=>{
                console.log(err);
                Alert.alert(
                    'Error',
                    err ? (err.error || err.message) : '',
                    {cancelable: false},
                );
            })


    };



    deleteItem=(id)=>{
        let url  =this.props.deleteUrl +id;



        postForm(url,{},  true,this.props, )
            .then(result=>{
                if(result.error || result.message){
                    Alert.alert(
                        'Error',
                        result.error || result.message,
                        {cancelable: false},
                    );
                    return false;
                }

                Alert.alert(
                    'Success',
                    'Deleted!',
                    {cancelable: false},
                );
                this.setState({ loading: false });
                this.makeRemoteRequest();
            })
            .catch(err=>{
                console.log(err);
                Alert.alert(
                    'Error',
                    err ? (err.error || err.message) : '',
                    {cancelable: false},
                );
            })

    };

    render() {
        let flexArr = [];
        let tableHead = this.props.fields.map((item,index)=>{
            let flex = 1;
            if(item.type==='checkbox'){
                flex = 0.5;
            }
            if(item.type==='date'){
                flex = 0.8;
            }
            if(item.type==='textarea'){
                flex = 1.5;
            }
            flexArr.push(flex);
            return item.label  ? item.label  : getLabel(item.name);
        });

        flexArr.push(0.5);
        tableHead.push('Actions');


        flexArr.unshift(0.2);
        tableHead.unshift('#');

        return (
            <SafeAreaView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}
            ><ImageModal
                images={this.state.modalImages}
                imageIndex={this.state.modalImagesIndex || 0}
                visible={this.state.modalVisible}
                setState={this.setState.bind(this)}
            /><View>
                <View style={{flexDirection:"row", justifyContent:'flex-end'}}>
                    {this.props.createUrl&&
                        <TouchableOpacity style={[commonStyles.button,{margin:10}]}
                                          onPress={e=>{this.props.navigation.navigate(this.props.itemClass,{
                                              pictures:this.props.pictures,
                                              sketches:this.props.sketches,
                                              fields:this.props.fields,
                                              updateUrl:this.props.updateUrl,
                                              createUrl:this.props.createUrl,
                                              customFieldsUrl:this.props.customFieldsUrl,
                                              orderId:this.props.orderId
                                          })}}
                        >
                            <Text style={{color:'#fff'}}>Create New</Text>
                        </TouchableOpacity>
                    }

                </View>
                <ScrollView >
                    <Table borderStyle={{borderColor: '#000',borderWidth:1}} style={{margin:5}}>
                        <Row data={tableHead} style={styles.head} textStyle={styles.text} flexArr={flexArr}/>
                        {
                            !!(this.state.items && Array.isArray(this.state.items)) ? this.state.items.map((rowData, rowIndex) => (
                                <TableWrapper key={rowIndex} style={styles.row} >
                                    <Cell data={rowIndex+1} textStyle={styles.text} flex={0.2}/>
                                    {
                                        this.props.fields.map((field, cellIndex) =>
                                            {
                                                let item  = rowData[field.name] ;
                                                let flex = 1;
                                                if(field.type==='image'){
                                                    let self = this;
                                                    let images = item.map(function (elem) {
                                                        return elem.file;
                                                    });

                                                    item = item.map(function(elem, index){
                                                        return <Icon
                                                            key={index}
                                                            onPress={()=>self.openImage(elem.file,images)}
                                                            size={normalizeFont(12)}
                                                            name={'image'}
                                                        />;
                                                    });
                                                    item = <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-around'}}>{item}</View>;
                                                }

                                                if(field.type==='textarea'){
                                                    flex = 1.5;
                                                }
                                                if(field.type==='checkbox') {
                                                    flex = 0.5;
                                                    item =  <Switch
                                                        value={item===1}
                                                        style={{alignSelf:'center'}}
                                                        onValueChange={value=>{
                                                            this.updateField(rowData.id,field.name,(value===true ? 1 : 0));
                                                            let items = this.state.items;

                                                            items[rowIndex][field.name]  = (value===true ? 1 : 0);
                                                            this.setState({
                                                                items : items
                                                            })
                                                        }}
                                                    />;
                                                }
                                                if(field.type==='date') {
                                                    item  = Moment(new Date(item)).format('MMM D,Y');
                                                    flex = 0.8;
                                                }


                                                    return <Cell key={cellIndex} data={item} textStyle={styles.text} flex={flex}/>

                                            }
                                        )
                                    }
                                    <Cell  data={
                                        <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-around'}}>
                                            <Icon name={'edit'}  onPress={e=>{this.props.navigation.navigate(this.props.itemClass,{
                                                    item:rowData,
                                                    id:rowData.id,
                                                    pictures:this.props.pictures,
                                                    sketches:this.props.sketches,
                                                    fields:this.props.fields,
                                                    updateUrl:this.props.updateUrl,
                                                    customFieldsUrl:this.props.customFieldsUrl,
                                                })}}
                                            />
                                            <Icon name={'delete'}  onPress={e=>{
                                                Alert.alert(
                                                    'Image delete',
                                                    'Are you sure want to delete this item?',
                                                    [
                                                        {
                                                            text: 'Cancel',
                                                            // onPress: () => console.log('Cancel Pressed'),
                                                            style: 'cancel',
                                                        },
                                                        {text: 'OK', onPress: () => this.deleteItem(rowData.id)},
                                                    ],
                                                    {cancelable: false},
                                                );
                                                }}
                                            />
                                        </View>
                                    } textStyle={styles.text} flex={0.5}/>
                                </TableWrapper>
                            ))
                                : <View><Text>Nothing found</Text></View>
                        }
                    </Table>
                    {this.state.loading && <ActivityIndicator/>}
                </ScrollView>

            </View>
            </SafeAreaView>
        )
    }



}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fff'
    },
    item:{
        backgroundColor: '#2196f3',
        margin:10,
        padding: 10,
        borderRadius : 10,
        flex:1,
    },
    textItem:{
        fontSize:normalizeFont(15),
        color:'#fff'
    },
    head: { height: 40, backgroundColor: '#808B97' },
    text: { margin: 6, textAlign:'center' },
    row: { flexDirection: 'row', backgroundColor: '#fff' },
    btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
    btnText: { textAlign: 'center', color: '#fff' }

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
export default connect(mapStateToProps, mapDispatchToProps)(ItemsList);
