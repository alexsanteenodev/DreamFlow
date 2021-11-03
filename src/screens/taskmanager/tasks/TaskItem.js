import React, {useState} from 'react';
import Swipeout from '../../../components/views/SwipeOut';
import {Badge, ListItem,Button} from 'react-native-elements';




const TaskItem = ({item,project,navigation,deleteTask,statuses,changeStatus}) =>{
    const [swipeToggle,setSwipeToggle]  = useState(false);


    const priorityStyle = item?.priorities?.color ? {
        backgroundColor :  item?.priorities?.color
    } : false;



    let index  = 2;
    let buttons = statuses ?  Object.keys(statuses).map(key=>{
        index+=1;
        let backGroundColor = `rgba(0,0,0, 0.${index})`;
        return {
            text: statuses[key],
            backgroundColor:backGroundColor,
            onPress:()=>{
                changeStatus(item.id,key);
            }
        }
    }) : [];


    return <Swipeout

        left={buttons}

        right={[
            { text: 'Edit',    type: 'primary', onPress:()=>{
                    navigation.navigate(
                        'TaskForm',
                        {
                            item:item,
                            projects_id:item.projects_id,
                        },
                    )
                }
            },
            // { text: 'Secondary',  type: 'secondary', },
            { text: 'Delete',     type: 'delete',   onPress:()=>{
                    deleteTask(item.id);
                } }
        ]}
        autoClose={true}
        swipeRightToggle={swipeToggle}
    >
        <ListItem bottomDivider onPress={e=>{
            e.preventDefault();
            navigation.navigate(
                'TaskView',
                {
                    item:item,
                    project:project,
                },
            )
        }}>
            <ListItem.Content >
                <ListItem.Title style={{  fontWeight: 'bold' }}>{item.name}</ListItem.Title>
                <ListItem.Subtitle style={{  color: '#ffa655' }}>Performer: {item?.performer?.firstname} {item?.performer?.lastname}</ListItem.Subtitle>
                <ListItem.Subtitle style={{  color: '#70bbef' }}>Author: {item?.author?.firstname} {item?.author?.lastname}</ListItem.Subtitle>
                <ListItem.Subtitle style={{  color: '#67696e' }}>Status: {item?.statuses?.name}</ListItem.Subtitle>
                <ListItem.Subtitle style={{  color: '#ef595f' }}>Deadline: {item?.deadline}</ListItem.Subtitle>
                {!!item?.order &&
                <ListItem.Subtitle>Order: {item?.order?.name} </ListItem.Subtitle>
                }
            </ListItem.Content>
            <Badge badgeStyle={priorityStyle}   value={item?.priorities?.name}/>
            <ListItem.Chevron onPress={()=>{setSwipeToggle(!swipeToggle)}} />
        </ListItem>
    </Swipeout>;
};
export default TaskItem;
