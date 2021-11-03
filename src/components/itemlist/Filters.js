import React from "react";
import {View} from "react-native";
import {Button} from "react-native-elements";

const Filters =({filters,applyFilter}) => {

    return (filters && filters.length) ? filters.map((item,index)=>{
        return <FilterItem key={index} item={item} applyFilter={applyFilter}/>
    }) : null;
}


const FilterItem=({item, applyFilter})=>{



    return <View style={{flex:1, flexDirection:'row', justifyContent:'space-around', marginBottom:10,marginTop:10, backgroundColo:"grey"}}>
        {!!item.values ?
        item.values.map((value,index)=> <Button
            buttonStyle={{
                backgroundColor:value.selected ? 'green' : '#2196f3',
            }}
            titleStyle={{
                color:value.selected ? '#fff' : 'inherit',
            }}
            type={value.selected ? 'outline' : 'solid'} key={index} title={value.label} onPress={()=>applyFilter(item.name,value.value)}/>)
        :
            null
        }
    </View>
}


export default Filters;
