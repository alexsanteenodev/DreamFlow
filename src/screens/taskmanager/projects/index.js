import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Alert} from 'react-native';
import styles from './styles';
import {get} from '../../../api/main';
import {setToken} from '../../../actions/auth';
import {connect} from 'react-redux';
import commonStyles from '../../styles';
import MultiPlatformPicker from '../../../components/MultiplatformPicker';
import usePrevious from '../../../functions/usePreviousValue';
import Icon from 'react-native-vector-icons/Ionicons';
import { withNavigationFocus } from 'react-navigation';
import FilterModal from "./filterModal";
import Switcher from '../../../components/modules/Switcher';
import TaskList from "./TaskList";
const Projects=({navigation,isFocused,...props})=>{



    const [tasks,setTasks] = useState([]);
    const [projects,setProjects] = useState([]);
    const [currentProject,setCurrentProject] = useState(false);
    const [page,setPage] = useState(1);
    const [loading,setLoading] = useState(true);
    const [statuses,setStatuses] = useState({});
    const [filters,setFilters] = useState({
        performer_id:[],
        statuses_id:[],
    });
    const [filterString,setFilterString] = useState(false);

    const prevPage = usePrevious({page});
    //
    useEffect(()=>{
        getProjects();
    },[isFocused,navigation.state.params,filterString]);
    useEffect(()=>{

        if(!page)
            return;

        if(currentProject && (!prevPage|| !prevPage.page || (prevPage.page && prevPage.page<=page)  )){
            getTasks(currentProject.id)
        }
    },[page,currentProject]);


    const getTasks = async (id,newProject) => {

        id = id || currentProject.id;

        setLoading(true);
        let url = `tasks/api/task/index?filter[projects_id]=${id}&page=${page}&per-page=100&sort=-created_at`;
        if(filterString){
            url+=`${filterString}`;
        }
        return get(url,{authToken: props.authToken}).then(result=>{
            if(result.error || result.message){
                Alert.alert(
                    'Error',
                    result.error || result.message,
                    {cancelable: false},
                );
                setLoading(false);
                return false;
            }

            if(!result || !result.length){
                setPage(false);
            }

            if(page===1){
                setTasks(result);
            }else{

                let results = result.filter(item=>{
                    return !tasks.find(task=>task.id===item.id)
                });
                if(results && results.length){
                    setTasks(  [...tasks, ...results] );
                }else{
                    setPage(false);
                }
            }

            setLoading(false);

            /**
             * Navigate from notifications to task
             */
            if(navigation.state.params && navigation.state.params.task_id){

                let taskFromNotification = result.find(item=>parseInt(item.id)===parseInt(navigation.state.params.task_id));
                if(taskFromNotification && taskFromNotification.id){
                    navigation.setParams({
                        task_id:false,
                        project_id:false,
                        projects:false,
                    });
                    navigation.navigate(
                        'TaskView',
                        {
                            item:taskFromNotification,
                            project:currentProject || newProject,
                        },
                    )
                }

            }



            return result;
        });
    };

    const getProjects = async() => {
        setLoading(true);
        const url = 'tasks/api/project/index';
        setPage(1);
        setTasks([]);
        if(!filterString){
            await getFilters();
        }

        return get(url,{navigation:navigation,authToken: props.authToken}).then(result=>{
            if(result.error || result.message){
                Alert.alert(
                    'Error',
                    result.error || result.message,
                    {
                                cancelable: false
                            },
                );
                return false;
            }
            setProjects(result);

            /**
             * Choose project from notification
             */
            if(navigation.state.params && navigation.state.params.project_id){
                let setProject  = [...result].find(item=>parseInt(item.id) === parseInt(navigation.state.params.project_id));
                if(setProject && setProject.id){
                    setCurrentProject(setProject);
                    getTasks(setProject.id,setProject);
                    return;
                }
            }


            if(!currentProject || !currentProject.id){
                setCurrentProject(result[0]);
            }else{
               getTasks(currentProject.id,currentProject)
            }

        });
    };

    const getFilters = async() => {
        let statuses = await get(`tasks/api/task/get-relations?type=status`,props);

        setStatuses(statuses);
        let newFilters ={...filters};

        Object.keys(statuses).map(id=>{
            newFilters.statuses_id.push({
                id:id,
                name:statuses[id],
                enabled: statuses[id].toLowerCase()!=='completed'
            });
        });

        newFilters.performer_id.push({
            id:props.userData.employee_id,
            name:'My Tasks',
            enabled: false
        });

        setFilters(newFilters);
        setFilterString(getFilterString(newFilters));
    };

    const getFilterString=(newFilters)=>{
        let filterString = '';

        Object.keys(newFilters).map(key=>{

            if(Array.isArray(newFilters[key])){

                let id = newFilters[key].filter(item=>item.enabled).map(item=>item.id).join(`&filter[${key}][in][]=`);
                if(id){
                    filterString +=`&filter[${key}][in][]=${newFilters[key].filter(item=>item.enabled).map(item=>item.id).join(`&filter[${key}][in][]=`)}`;
                }
            }else{
                if(newFilters[key]){
                    filterString+=`&filter[${key}]=${newFilters[key]}`;
                }
            }

        });
        return filterString;
    };

    const saveFilters=async(filters)=>{
        setFilters(filters);
        setFilterString(getFilterString(filters));
    };



    const selectProject=(name,value)=>{
        setPage(1);
        setTasks([]);
        let newProject = [...projects].find(item=>item.id===value);
        setCurrentProject(newProject);
        getTasks(value,newProject);
    };

    const filterMyTasks=()=>{
        let newFilters = {...filters};

        if(newFilters.performer_id && newFilters.performer_id[0] && newFilters.performer_id[0].id){
            newFilters.performer_id[0].enabled = !newFilters.performer_id[0].enabled;
        }
        setFilters(newFilters);
        setFilterString(getFilterString(newFilters));

    };

    const handleLoadMore=(e)=>{
        // if(!page)
        //     return;

        // setPage(page+1);
    };

    const ProjectSelector=()=>
        <View style={{flex: 1, justifyContent:'space-around', alignItems:'center',flexDirection:'row', marginBottom:20}}>
            <FilterModal data={filters} saveFilters={saveFilters}/>
            <Switcher

                index={filters?.performer_id[0]?.enabled ? 1 : 0}
                buttons={
                    ['All','My' ]
                }
                containerStyle={{width:100}}
                onPress={()=>{
                    filterMyTasks();
                }}
            />
            <View style={styles.inputContainer}>

                <MultiPlatformPicker
                    style={[commonStyles.selectItem,{
                        alignSelf:'center',
                        padding:0,
                        alignItems:'center',
                        textAlign:'center',
                        backgroundColor:'transparent',
                    }]}
                    onChange = {(name,value) => {
                        selectProject(name,value)
                        // this.setState({[name]:value})
                    }}
                    values={projects}
                    valueKey={'id'}
                    labelKey={'name'}
                    value={(currentProject ? currentProject.name:false)}
                    name={'project'}
                />
            </View>
            <Icon name={'add'} size={30}
                  onPress={e=>{navigation.navigate(
                      'TaskForm',
                      {
                          projects_id:currentProject.id
                      },
                  )}}
            />
        </View>;


    const refresh=async()=>{
        return getTasks(currentProject.id)
    };


    return <SafeAreaView style={{flex: 1}}>
            <TaskList
                loading={loading}
                refresh={refresh}
                handleLoadMore={handleLoadMore}
                tasks={tasks}
                header={<ProjectSelector/>}
                navigation={navigation}
                currentProject={currentProject}
                statuses={statuses}
                getTasks={getTasks}
            />
        </SafeAreaView>
};


// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {

    // Redux Store --> Component
    return {
        authToken: state.authReducer.authToken,
        userData: state.authReducer.userData,
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
export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(Projects));

