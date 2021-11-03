import React, {useState} from 'react';
import {View, SafeAreaView, Alert} from 'react-native';
import {InputForm} from '../../../../components/InputForm';
import ScrollListBasics from '../../../../components/views/ScrollListBasic';
import {ListItem} from 'react-native-elements';
import {postForm} from '../../../../api/main';
import {setToken} from '../../../../actions/auth';
import {connect} from 'react-redux';

const Comments=({navigation,task,...props})=>{

    const[comment,setComment] = useState({
        text:''
    });
    const[comments,setComments] = useState(task.comments);

    const onSubmit=async (item)=>{


        let url = 'tasks/api/comments/create';
        let method= 'POST';

        let id =  item.id  ;
        if(id){
            url = `tasks/api/comments/update?id=${id}`;
            method='PUT';
        }

        item.tasks_id = task.id;
        let result = await postForm(url,item,  true,props,method);
        if(result && result.id ){
            Alert.alert('Saved!');
            let newComments  = [...comments];
            if(id){
                newComments = newComments.map(comment=>{
                    if(comment.id===id){
                        comment.text = item.text
                    }
                    return comment
                })
            }else{
                newComments.push(result);
            }
            setComments(newComments);
            onClose();
        }
    };

    const editComment=async(item)=>{
        setComment(item)
    };
    const deleteComment=async(item)=>{

        Alert.alert(
            'Confirm',
            'Are you sure you want to delete this comment?',
            [
                {text: 'No',
                    style: "cancel"
                },
                {text: 'Yes',
                    onPress: async () => {
                        const url = `tasks/api/comments/delete?id=${item.id}`;
                        await postForm(url,{},true,props,'DELETE');
                        let newComments = [...comments].filter(comment=>comment.id!==item.id);
                        setComments(newComments);

                    }
                },
            ],
            {
                cancelable: true
            }
        );

    };

    const onClose=()=>{
        setComment({text:''})
    };

    return <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1,justifyContent:'flex-start'}}>
                <View style={{flex:1,flexDirection: "column", alignItems: "stretch"}}>
                    <InputForm
                        navigation = {navigation}
                        item={comment? comment: {}}
                        state={{}}
                        fields={[
                            {name:'text',label:'Comment', type:"textarea"}
                        ]}
                        onSubmit={onSubmit}
                        onClose={onClose}
                        onCloseText={'Clear'}
                    />
                </View>
                <View style={{flex:2,flexDirection: "column", alignItems: "stretch"}}>
                    <ScrollListBasics
                        data={comments}
                        renderItem={({item})=>(<ListItem bottomDivider>
                            <ListItem.Content >
                                <ListItem.Title>{item.text}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron size={30} name={'pencil'} color={'black'} onPress={()=>editComment(item)} />
                            <ListItem.Chevron size={30} name={'trash'} color={'red'} onPress={()=>deleteComment(item)} />
                        </ListItem>)}
                    />
                </View>
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
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    // Action
    return {
        setToken: (logged) => dispatch(setToken(logged)),
    };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(Comments);

