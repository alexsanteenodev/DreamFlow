import React, {useState} from "react";
import {Modal, View, Text, SafeAreaView, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import {capitalize} from '../../../functions/frontend'
import {CheckBox} from "react-native-elements";
import {MyText} from "../../../components/views/Base";
import commonStyles from "../../styles";
const FilterModal=({data,saveFilters})=>{

    const [filters,setFilters]=useState(data);

    const [show,setShow]= useState(false);


    const formatFilterName=(name)=>{

        return capitalize(name).replace('_id','');
    };


    const changeFilters=(key,filter)=>{

        const newFilters = {...filters};

        newFilters[key] = newFilters[key].map(item=>{
            if(item.name===filter.name){
                item.enabled =! item.enabled;
            }
            return  item
        });

        setFilters(newFilters);

    };

    return <>
                <Icon name={'filter'} size={25} onPress={()=>setShow(!show)}/>
                <Modal
                    transparent={false}
                    animationType="fade"
                    visible={show}
                >
                    <SafeAreaView
                        style={{
                            flex: 1,
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            backgroundColor: '#eaeaea',}}
                    >

                        {Object.keys(filters).map(key=>
                            <View key={key} style={{
                                // flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#eaeaea',}}
                            >
                                <MyText style={{fontSize:20}}>{formatFilterName(key)}</MyText>
                                {!!Array.isArray(filters[key]) ? filters[key].map(item=>
                                    <CheckBox
                                        key={item.id || item}
                                        onPress={()=>changeFilters(key,item)}
                                        title={item.name}
                                        checked={item.enabled}
                                    />
                                ) :
                                    <CheckBox
                                        key={key}
                                        onPress={()=>changeFilters(key)}
                                        title={key}
                                        checked={filters[key]}
                                    />
                                }
                            </View>
                        )}
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <TouchableOpacity
                                style={[commonStyles.button,{marginRight:10,backgroundColor:'#fff',borderColor:'#000'}]}
                                onPress={()=>setShow(false)}
                            >
                                <Text style={{color:'#000'}} >Close</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={commonStyles.button}
                                onPress={()=>{
                                    setShow(false);
                                    saveFilters(filters)
                                }}
                            >
                                <Text style={{color:'#fff'}} >Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Modal>
            </>
};
export default FilterModal;
