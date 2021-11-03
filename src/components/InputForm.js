import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import commonStyles from '../screens/styles';
import {InputContainer} from './InputContainer';
import {getLabel} from '../functions/frontend';
import {Icon} from 'react-native-elements';
import Moment from 'moment';


export class InputForm  extends React.Component{


    state={
        errors:{},
        item:this.props.item
    };
    setInput=(name,value,type)=>{
        if(type==='date'){
            value = Moment(new Date(value)).format('YYYY-MM-DD');
        }
        let item  = this.state.item;
        item[name]= value;
        this.setState({item:item})
    };
    setTexts=(index,value)=>{
        let item  = this.state.item;
        item.texts[index].text= value;
        this.setState({item:item})
    };

    addLine=()=>{
        let item  = this.state.item;
        item.texts.push({});
        this.setState({item:item},()=>{
        })

    };

    deleteLine(text) {
        let texts = [...this.state.item.texts];

        let index = texts.indexOf(text);

        if (index !== -1) {
            texts.splice(index, 1);

            let item = this.state.item;
            item.texts = texts;
            this.setState({item: item});
        }
    };

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(JSON.stringify(prevProps.item)!==JSON.stringify(this.props.item)){
            this.setState({
                item:this.props.item
            })
        }
    }

    render() {
        return (
            <ScrollView
                style={{flex:1}}
            >
                <View  style={styles.inputView}>
                    {this.props.fields && this.props.fields.map((field,index)=>{
                        let value = this.state.item ? this.state.item[field.name ? field.name : field] : '';
                        if(field.data && (field.type==='select')){
                            value = (field.data && Array.isArray(field.data)) ? field.data.find(item=>{

                                if(!isNaN(parseInt(item.id)) && !isNaN(parseInt(value))){
                                    return item && parseInt(item.id)===parseInt(value)
                                }else {

                                    return item && value && item.id.toString()===value.toString()

                                }

                                return false;

                            }) : false;


                        }

                         return ( field.type !=='image' ) &&  <InputContainer
                                state={this.state}
                                name={field.name ? field.name : field }
                                type={field.type}
                                error={field.error}
                                field={field}
                                label={getLabel(field.label || (field.name ? field.name : field))}
                                value={value}
                                onChangeText={value=>this.setInput(field.name ? field.name : field,value,field.type)}
                                // keyboardType={'numeric'}
                                key={index}
                                multiline={(field.type && field.type==='textarea')}
                                numberOfLines={(field.type && field.type==='textarea') ? 4 : 1}
                            />;
                    }

                    )}
                </View>
                <View>

                    {(this.state.item && this.state.item.texts) ? <>
                            <View style={{
                                backgroundColor:'#3f50ff',
                                alignItems:'center'
                            }}>
                                <Text style={{color:'#000', }}>Items</Text>
                            </View>
                            {this.state.item.texts.map((item,index)=>{
                                return <View key={index} style={{flexDirection:'row',alignItems:'center'}}>
                                    <View style={{flex:9/10}}>
                                        <InputContainer
                                            state={this.state}
                                            name={'CmText[text][]'}
                                            type={'text'}
                                            label={''}
                                            value={item.text}
                                            onChangeText={value=>this.setTexts(index,value)}
                                            // keyboardType={'numeric'}
                                        />
                                    </View>
                                    <View style={{flex:1/10}}>
                                        <Icon name={'delete'} onPress={e=>this.deleteLine(item)}/>
                                    </View>
                                </View>
                            })}
                            <TouchableOpacity
                                style={[commonStyles.button,{backgroundColor: '#4da044',marginBottom:10}]}
                                onPress={e=>this.addLine()}
                            >
                                <Text style={{color:'#fff'}}>Add new line</Text>
                            </TouchableOpacity></>

                        : null
                    }

                </View>
                <View  style={styles.inputView}>

                    {this.props.state.loading ?
                        <ActivityIndicator/>
                        :

                        <View style={{flex:2,flexDirection:'row', justifyContent:'space-between'}}>
                            {!!this.props.onClose &&
                            <TouchableOpacity
                                style={[commonStyles.button,{marginRight:10,backgroundColor:'#fff',borderColor:'#000'}]}
                                onPress={e=>this.props.onClose(this.state.item)}
                            >
                                <Text style={{color:'#000'}}>{this.props.onCloseText ? this.props.onCloseText : 'Close'}</Text>
                            </TouchableOpacity>
                            }

                            <TouchableOpacity
                                style={commonStyles.button}
                                onPress={e=>this.props.onSubmit(this.state.item)}
                            >
                                <Text style={{color:'#fff'}}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    }

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    inputContainer:{
        flexDirection:'row',
        alignItems:'center'
    },
    rowContainer:{
        flexDirection: 'column',
        alignItems: 'center'
    },

    inputView:{
        flex:1,
        marginTop:20,
        alignItems:'center',
    }
});

