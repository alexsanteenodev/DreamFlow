import {TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from "react-native-elements";
import { withNavigation} from 'react-navigation';

const MyTasksIcon=({navigation})=>{


    return <TouchableOpacity style={{marginRight:20}}
                             onPress={() => navigation.navigate('MyTasks')}
    >
                <Icon name='tasks' type={'font-awesome'} size={20} style={{paddingHorizontal: 10}}/>
            </TouchableOpacity>
};
export default withNavigation(MyTasksIcon)
