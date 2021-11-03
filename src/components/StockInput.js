import MultiPlatformPicker from './MultiplatformPicker';
import React, {useEffect, useState} from 'react';
import {get} from '../api/main';
import {connect} from 'react-redux';
import {setToken} from '../actions/auth';


const StockInput=({style,name,label,onChange,value,...props})=>{
    const [values,setValues]= useState([]);


    useEffect(()=>{
        getValues()
    },[]);

    const getValues=()=>{
        const url = 'product/api/product/products';

        get(url,props)
            .then(result => {

             let products = result.map(item=>{
                 return {
                     id:item.product_id,
                     name:item.name,
                     value:item.product_id,
                 }
             });

            setValues(products);
        }).catch(err=>{
            console.error(err)
        })
    };



        let currentValue = values.find(item=>{
            return item && parseInt(item.id)===parseInt(value)
        });

    return <MultiPlatformPicker
        style={style}
        titleStyle={{
            fontSize:20,
            color: '#000'
        }}
        placeholderStyle={{
            fontSize:20,
            color: '#c9c9c9'
        }}
        onChange={onChange}
        values={values}
        valueKey={'id'}
        labelKey={'name'}
        value={currentValue}
        name={name}
        label={label}
    />;
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
export default connect(mapStateToProps, mapDispatchToProps)(StockInput);

