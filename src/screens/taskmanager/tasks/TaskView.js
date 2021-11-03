import {setToken} from "../../../actions/auth";
import {connect} from "react-redux";
import {Dimensions, SafeAreaView} from "react-native";
import {TabBar, TabView} from "react-native-tab-view";
import React, {useState} from "react";
import Info from './view/Info';
import History from './view/History';
import Comments from './view/Comments';
import ImagesLoader from '../../../components/ImagesLoader';


const TaskView = ({navigation,...props})=>{
    const [task,setTask]  = useState(navigation?.state?.params?.item);
    const [index,setIndex]=useState(0 );
    const [routes,setRoutes]=useState([
        { key: 'main', title: 'Main Info' },
        { key: 'comments', title: 'Comments' },
        { key: 'history', title: 'History' },
        { key: 'files', title: 'Files' },
    ]);



    return  <SafeAreaView  style={{flex:1}}>
                <TabView
                    navigationState={{index: index,
                        routes:routes,
                    }}
                    renderScene={({ route }) => {
                        switch (route.key) {
                            case 'main':
                                return  <Info task={task} navigation={navigation}/>
                            case 'history':
                                return  <History task={task}/>
                            case 'comments':
                                return  <Comments task={task} navigation={navigation}/>
                            case 'files':
                                return <ImagesLoader
                                        navigation = {navigation}
                                            type={'pictures'}
                                            url={ `tasks/api/task/get-images?id=${ task.id || navigation?.state?.params?.id }`}
                                            saveUrl={ `tasks/api/task/save-files?id=${ task.id || navigation?.state?.params?.id }`}
                                            fileType={true}
                                        />
                        }
                    }}
                    renderTabBar={props =>{

                        return <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: 'white' }}
                        />
                    }
                    }
                    onIndexChange={index => setIndex(index)}
                    initialLayout={{ width: Dimensions.get('window').width }}
                />
    </SafeAreaView>;
};

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
export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
