import React,{Component} from 'react';
import {StyleSheet, Text} from 'react-native';


export class MyText extends Component{
    render(): React.ReactNode {
        return <Text style={[styles.text,this.props.style]}>{this.props.children}</Text>;
    }


}

const styles = StyleSheet.create({
    text:{
        textTransform:'uppercase'
    }

});

