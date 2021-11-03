
import React, {useEffect, useState} from "react";
import {Alert,SafeAreaView} from "react-native";
import {get, postForm} from "../../../api/main";
import {setToken} from "../../../actions/auth";
import {connect} from "react-redux";
import {withNavigationFocus} from "react-navigation";
import {groupTasksByProjectName} from "../../../functions/main";
import TaskList from "./TaskList";


const MyTasks=({navigation,...props})=>{

    const [tasks,setTasks] = useState([]);
    const [statuses,setStatuses] = useState({});
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        getTasks();
    },[]);



    const getStatuses=async ()=>{
        let statuses = await get(`tasks/api/task/get-relations?type=status`,props);
        setStatuses(statuses);
        return statuses;
    };



    const getTasks=async ()=>{
        let statuses = await getStatuses();


        let url = `tasks/api/task/index?filter[performer_id][in][]=${props.userData.employee_id}&per-page=100&sort=projects_id`;

        Object.keys(statuses).forEach(id=>{

            if(statuses[id].toLowerCase()!=='completed'){
                url+=`&filter[statuses_id][in][]=${id}`
            }
        });



        setLoading(true);
        try {
            get(url,{authToken: props.authToken}).then(result=>{
                if(result.error || result.message){
                    Alert.alert(
                        'Error',
                        result.error || result.message,
                        {cancelable: false},
                    );
                    setLoading(false);
                    return false;
                }
                setLoading(false);
                result = groupTasksByProjectName(result);
                setTasks(result);
            })
        }catch (e) {
            Alert.alert(
                'Error',
                e.message,
                {cancelable: false},
            );
            setLoading(false);
        }

    };


    return <SafeAreaView style={{flex:1}}>
                <TaskList
                    loading={loading}
                    refresh={getTasks}
                    // handleLoadMore={handleLoadMore}
                    tasks={tasks}
                    // header={<ProjectSelector/>}
                    navigation={navigation}
                    statuses={statuses}
                    getTasks={getTasks}
                    grouped={true}
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
export default connect(mapStateToProps, mapDispatchToProps)(withNavigationFocus(MyTasks));



