import ScrollListBasics from "../../../components/views/ScrollListBasic";
import TaskItem from "../tasks/TaskItem";
import {Alert, SectionList, Text, View, StyleSheet, StatusBar, ActivityIndicator} from 'react-native';
import React from "react";
import {postForm} from "../../../api/main";
import Toast from "react-native-toast-message";
import {connect} from 'react-redux';


const TaskList=({loading,refresh,handleLoadMore,tasks, header,navigation,currentProject,statuses,getTasks,grouped,...props})=>{

    const changeStatus=async(itemId, statusId)=>{
        try {
            let result = await postForm(`tasks/api/task/update?id=${itemId}`,{
                statuses_id:statusId
            },  true,props,'PUT');
            if(result && result.id){
                Toast.show({
                    text1:'Status changed!',
                    position: 'bottom',
                });
                await getTasks()
            }
        }catch (e) {
            console.error(e.message);
        }
    };


    const deleteTask = async (id) => {

        Alert.alert(
            'Confirm',
            'Are you sure you want to delete this task?',
            [
                {text: 'No',
                    // onPress: () => navigation.goBack(null)
                    style: "cancel"
                },
                {text: 'Yes',
                    onPress: async () => {
                        const url = `tasks/api/task/delete?id=${id}`;
                        await postForm(url,{},true,props,'DELETE');
                        getTasks();
                    }
                },
            ],
            {
                cancelable: true
            }
        );


    };



    const renderFooter = () => {
        if (!loading  && !tasks.length)
            return <View style={{flex:1, alignItems:'center'}}><Text>Nothing found</Text></View>;

        if(!loading)
            return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large" />
            </View>
        );
    };





    return <View style={styles.container}>
        {grouped ?
            <SectionList
                sections={tasks}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) =>
                    <TaskItem navigation={navigation}  item={item} project={item.project} statuses={statuses} changeStatus={changeStatus} deleteTask={deleteTask} />
                }
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.header}><Text  style={styles.headerText}>{title}</Text></View>
                )}
                ListFooterComponent={renderFooter}
            />
            :
            <ScrollListBasics
                loading={loading}
                handleLoadMore={handleLoadMore}
                data={tasks}
                renderItem={({item})=>(<TaskItem navigation={navigation} deleteTask={deleteTask} item={item} project={currentProject} statuses={statuses} changeStatus={changeStatus}/>)}
                header={header}
                refresh={refresh}
            />
        }
        </View>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    header: {
        backgroundColor: "#fff",
        borderBottomColor:'#bfbfbf',
        borderBottomWidth:2,
    },
    headerText: {
        fontSize: 32,
        textAlign:'center'
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
export default connect(mapStateToProps, mapDispatchToProps)(TaskList);

