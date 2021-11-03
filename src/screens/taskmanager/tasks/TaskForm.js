import {InputForm} from '../../../components/InputForm';
import React, {useEffect, useState} from 'react';
import {Alert, Dimensions, SafeAreaView, Text, View} from 'react-native';
import {get, postForm} from '../../../api/main';
import {setToken} from '../../../actions/auth';
import {connect} from 'react-redux';
import {TabBar, TabView} from 'react-native-tab-view';
import ImagesLoader from '../../../components/ImagesLoader';
import SketchList from '../../../components/SketchList';
import {DataURIToBlob} from "../../../functions/main";




const TaskForm=({navigation,...props})=>{



    const initialFields = [
        {name:'name',label:'Name', type:"text"},
        {name:'description',label:'Description', type:"textarea"},
        {name:'deadline',label:'Deadline', type:"date"},
        {name:'started',label:'Started', type:"date"},
        {name:'order_id',label:'Order', type:"text"},
        {name:'performer_id',label:'Performer', type:"text"},
        {name:'statuses_id',label:'Status', type:"text"},
        {name:'priorities_id',label:'Priority', type:"text"},
        {name:'projects_id',label:'Project', type:"text"},
    ];




    const [task,setTask] = useState(navigation?.state?.params?.item || {});

    const [fields,setFields]=useState([...initialFields] );
    const [index,setIndex]=useState(0 );
    const [routes,setRoutes]=useState([
        { key: 'main', title: 'Main' },
        { key: 'files', title: 'Files' },
    ] );



    useEffect(()=>{

        getRelations();


    },[]);

    const getRelations=async ()=>{
        let order_id= await get(`tasks/api/task/get-relations?type=order`,props);
        let statuses_id= await get(`tasks/api/task/get-relations?type=status`,props);
        let priorities_id = await get(`tasks/api/task/get-relations?type=priority`,props);
        let performer_id = await get(`tasks/api/task/get-relations?type=performer`,props);
        let projects_id = await get(`tasks/api/task/get-relations?type=project`,props);
        let relations={
            order_id,statuses_id,priorities_id,performer_id,projects_id
        };


        let newFields = fields.map(field=>{
            let newField = {...field}
            if(relations[newField.name]){
                newField.data = Object.keys(relations[field.name]).map(key=>{
                    return {
                        id:key,
                        name:relations[field.name][key]
                    }
                });
                newField.type = 'select';
            }
            return newField;
        });

        setFields(newFields);
    };


    const onSubmit=async(item)=>{


        setFields([...initialFields]);

        let url = 'tasks/api/task/create';
        let method= 'POST';
        let id =  task.id || navigation?.state?.params?.id  ;
        if(id){
            url = `tasks/api/task/update?id=${id}`;
            method='PUT';
        }
        if(item.data){
            item = {...item.data,...task}
        }
        let data = {};


        item.projects_id =item.projects_id ||  navigation?.state?.params?.projects_id;
        let json = true;
        if(item && item.images && typeof item.images!=='undefined'){
            data =  item.images;
            json=false;
        }else{
            data = {...item};
        }


        let result = await postForm(url,data,  json,props,method);

        if(result && result.error && result.fields){

            let newFields = [...fields].map(field=>{
                if(field.name && result.fields.find(item =>item.field===field.name)){
                    field.error  = result.fields.find(item =>item.field===field.name).message
                }else{
                    field.error = false
                }
                return field;
            });

            setFields(newFields)

        }
        if(result)

        if(result.id){
            setTask(result);
            Alert.alert(
                'Success',
                'Saved!',
                [
                    {text: 'OK',
                        onPress: () => {
                        // navigation.navigate('Projects')
                        navigation.goBack(null)
                        }
                    },
                ],
                {
                    cancelable: true
                }
            );
        }else
            if(result.message){
                Alert.alert(
                    'Error',
                    result.message,
                    [
                        {text: 'OK',
                            onPress: () => setIndex(0)
                        },
                    ],
                    {
                        cancelable: true
                    }
                );
            }


        getRelations();


    };

    return <SafeAreaView style={{flex:1}}>
        <TabView

            navigationState={{index: index,
                routes:routes,
            }}
            renderScene={({ route }) => {
                switch (route.key) {
                    case 'main':
                        return   <InputForm
                            navigation = {navigation}
                            state={{}}
                            item={task}
                            fields={fields}
                            onSubmit={onSubmit}
                        />;
                    case 'files':
                        return  task ?
                            <ImagesLoader
                                navigation = {navigation}
                                type={'pictures'}
                                url={ `tasks/api/task/get-images?id=${ task.id || navigation?.state?.params?.id }`}
                                saveUrl={ `tasks/api/task/save-files?id=${ task.id || navigation?.state?.params?.id }`}
                                fileType={true}
                            />
                            :
                            <View style={{alignItems:'center'}}><Text>Please create task first</Text></View>;
             }
            }}
            renderTabBar={props =>{

                return <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: 'white' }}
                            // style={{ backgroundColor: 'pink' }}
                        />
            }
            }
            onIndexChange={index => setIndex(index)}
            initialLayout={{ width: Dimensions.get('window').width }}
        />
    </SafeAreaView>;
};


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
export default connect(mapStateToProps, mapDispatchToProps)(TaskForm);
