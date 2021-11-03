import {ListItem} from 'react-native-elements';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {MyText} from '../../../../components/views/Base';
import commonStyles from "../../../styles";


const Info=({task,navigation})=>{

    const priorityStyle = task?.priorities?.color ? {
        color :  task?.priorities?.color
    } : false;
    console.log('task',task)
    return <View>
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={{  fontWeight: 'bold' }}>{task.name}</ListItem.Title>
            </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Subtitle style={priorityStyle}>Priority: {task?.priorities?.name} </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Subtitle>Order: {task?.order?.name} </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Subtitle>Performer: {task?.performer?.firstname} {task?.performer?.lastname}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Subtitle>Author: {task?.author?.firstname} {task?.author?.lastname}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Subtitle>Status: {task?.statuses?.name}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Subtitle>Deadline: {task?.deadline}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem >
        <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Subtitle>Created: {task?.created_at}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
        <ListItem bottomDivider>
            <ListItem.Content>
                <MyText>{task?.description}</MyText>
            </ListItem.Content>
        </ListItem>
        <View style={{flexDirection:'row', justifyContent:'center',marginTop:20}}>
            <TouchableOpacity
                style={commonStyles.button}
                onPress={()=>{
            navigation.navigate(
                    'TaskForm',
                                {
                                    item:task,
                                    projects_id:task.projects_id,
                                },
                            )
                        }
                }
            >
                <Text style={{color:'#fff'}} >Edit</Text>
            </TouchableOpacity>
        </View>
    </View>
};
export default Info;
