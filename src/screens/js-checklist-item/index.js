import React from 'react';
import {setToken} from '../../actions/auth';
import {connect} from 'react-redux';
import {View, StyleSheet, Dimensions, ScrollView, Text, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import { TabView,TabBar} from 'react-native-tab-view';
import ImagesLoader from '../../components/ImagesLoader';
import SketchList from '../../components/SketchList';
import {get, postForm} from '../../api/main';
import {InputForm} from '../../components/InputForm';

class JSCheckListItem extends React.Component {



    constructor(props) {
        super(props);
        this.item = this.props.navigation.state.params.item;
        this.createUrl = this.props.navigation.state.params.createUrl;
        this.updateUrl = this.props.navigation.state.params.updateUrl;
        this.customFieldsUrl = this.props.navigation.state.params.customFieldsUrl;
        this.orderId = this.props.navigation.state.params.orderId;
        this.fields = this.props.navigation.state.params.fields;
        this.pictures = this.props.navigation.state.params.pictures;
        this.sketches = this.props.navigation.state.params.sketches;

        this.state={
            routes : [
                { key: 'main', title: 'Main' },
                { key: 'images', title: 'Images' },
                { key: 'sketch', title: 'Sketch' },
            ],
            index:0,
            fields:this.fields,
            item:this.item,
        };

        this.state.routes =  this.state.routes.filter(item=>{
            if(item.key==='images' && !this.pictures){
                return;
            }
            if(item.key==='sketch' && !this.sketches){
                return;
            }

            return item;
        })


    }


    componentDidMount(): void {
        this.getCustomFields()
    }




    getCustomFields=()=>{
        if(this.customFieldsUrl){
            get(this.customFieldsUrl, this.props).then(result=>{
                if(result && result.length){
                    let newFields = [...this.state.fields];
                    let newItem = {...this.state.item};

                    if(this.state.item && this.state.item.fieldsValues){
                        let field=false;
                        this.state.item.fieldsValues.forEach(fieldValue=>{


                            field = result.find(fieldItem=>{
                                return fieldItem.id===fieldValue.id;
                            });

                            newItem[`CmFieldValues[value][${field.id}]`] =  fieldValue.value;


                            let newField = {
                                name:`CmFieldValues[value][${field.id}]`,
                                label:field.name,
                                type: field.type || 'text',
                                relation:true
                            };

                            if(field.type==='select'){
                                newField.type = 'select';
                                newField.data = field.input_values.split(',').map((item,index)=>{
                                    return {
                                        name:item.trim(),
                                        value:item.trim(),
                                        id:item,
                                    }
                                })
                            }
                            newFields.push(newField)
                        });
                    }else{

                        result.forEach(field=>{
                            let newField = {
                                name:`CmFieldValues[value][${field.id}]`,
                                label:field.name,
                                type: field.type || 'text',
                                relation:true
                            };

                            if(field.type==='select'){
                                newField.type = 'select';
                                newField.data = field.input_values.split(',').map((item,index)=>{
                                    return {
                                        name:item.trim(),
                                        value:item.trim(),
                                        id:item,
                                    }
                                })
                            }
                            newFields.push(newField);
                            newItem[`CmFieldValues[value][${field.id}]`] =  '';

                        });

                    }
                    this.setState({fields:newFields,item:newItem})

                }
            })
        }
    };


    onSubmit=(item)=>{
        this.setState({ loading: true });
        this.state.item ? item.saveFiles = true :false;

        let url  =  (this.state.item && this.state.item.id) ? this.updateUrl + this.state.item.id : this.createUrl;
        if(this.orderId){
            item.order_id = this.orderId;
        }

        postForm(url,item,  true,this.props,'POST','application/x-www-form-urlencoded;charset=UTF-8')
            .then(result=>{
                if(result.error || result.message || !result.id){
                    Alert.alert(
                        'Error',
                        result.error || result.message || (result instanceof Array ? result.join(',') : result),
                        {cancelable: false},
                    );
                    return false;
                }


                if(result.id){
                    this.setState({
                        item:result
                    });

                    this.id = result.id;
                    Alert.alert(
                        'Success',
                        'Saved!',
                        [{text: 'OK', onPress: () =>this.props.navigation.goBack(),}],
                        {cancelable: false},
                    );
                }
                this.setState({ loading: false });
            })
            .catch(err=>{
                console.log(err);
                Alert.alert(
                    'Error',
                    err.error || err.message,
                    {cancelable: false},
                );
            })
    };



    render() {
        return(
            <View style={{
                flex:1,
            }}>

                <TabView
                    navigationState={{index: this.state.index,
                        routes:this.state.routes,
                    }}
                    renderScene={({ route }) => {
                        switch (route.key) {
                            case 'main':
                                return  <InputForm
                                    navigation = {this.props.navigation}
                                    onSubmit = {this.onSubmit.bind(this)}
                                    state={this.state}
                                    item={this.state.item ? this.state.item : {}}
                                    fields={this.state.fields}
                                />;
                            case 'images':
                                return this.state.item?  <ImagesLoader
                                    navigation = {this.props.navigation}
                                    id = {this.id}
                                    type={this.pictures}
                                    fileType={true}
                                /> : <View style={{alignItems:'center'}}><Text>Please create first</Text></View>;
                            case 'sketch':
                                return this.state.item?   <SketchList
                                    navigation = {this.props.navigation}
                                    id = {this.id}
                                    type={this.sketches}
                                    fileType={true}
                                /> : <View style={{alignItems:'center'}}><Text>Please create first</Text></View>;
                        }
                    }}
                    renderTabBar={props =>{

                        return this.state.item ?  <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: 'white' }}
                            // style={{ backgroundColor: 'pink' }}
                        /> : <View style={{alignItems:'center', backgroundColor:'#575dff'}}><Text style={{color:'#fff'}}>Create</Text></View>
                    }
                    }
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                />
            </View>
        );

    }


}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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
export default connect(mapStateToProps, mapDispatchToProps)(JSCheckListItem);
