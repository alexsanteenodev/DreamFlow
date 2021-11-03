import {Alert, SafeAreaView, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {get} from '../../../../api/main';
import {connect} from 'react-redux';
import ScrollListBasics from '../../../../components/views/ScrollListBasic';
import HistoryItem from './HistoryItem';


const History=({task,...props})=>{

    const [history,setHistory] = useState([]);
    const [loading,setLoading] = useState(true);



    const getHistory=async()=>{
        const url = `tasks/api/task/task-history?filter[task_id]=${task.id}`;
        setLoading(true);
        get(url,props).then(result=>{
            if(result.error || result.message){
                Alert.alert(
                    'Error',
                    result.error || result.message,
                    {cancelable: false},
                );
                return false;
            }
            setHistory(result);
            setLoading(false);

        });
    };

    useEffect(()=>{
        getHistory();
    },[task]);

    return <SafeAreaView style={{flex: 1}}>
                <View style={{flex: 1}}>
                    <ScrollListBasics
                        loading={loading}
                        data={history}
                        renderItem={({item})=>(<HistoryItem item={item}/>)}
                        // header={<ProjectSelector/>}
                    />
                </View>
            </SafeAreaView>
};
// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {

    // Redux Store --> Component
    return {
        authToken: state.authReducer.authToken,
    };
};

// Exports
export default connect(mapStateToProps)(History);


