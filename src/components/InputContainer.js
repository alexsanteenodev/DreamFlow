import React,{Component} from 'react';
import {StyleSheet, View, Text, Switch, Dimensions} from 'react-native';
import commonStyles from '../screens/styles';
import DatePicker from './datepicker/datepicker';
import Moment from 'moment';
import { Input } from 'react-native-elements';
import MultiPlatformPicker from "./MultiplatformPicker";
import StockInput from './StockInput';


export class InputContainer extends Component{



    constructor(props) {
        super(props);
        this.state={
            focus:false
        };
        this.getDateStr = this.getDateStr.bind(this);
    }

    render() {
        return <View style={[styles.rowContainer]}>
            <View style={{flexDirection: 'row'}}>
                <View style={[{flex:1, backgroundColor:'#fff',padding:10,   }, (this.props.multiline===true) ?
                    {
                }:false]}>
                    {(this.state.focus||this.props.value ||  this.props.type==='checkbox'||  this.props.type==='stock'||this.props.type==='date'||  this.props.type==='select')
                        ?
                        <Text style={commonStyles.selectTitle}>{this.props.label}</Text>
                        :null
                    }
                    {this.renderSwitch()}
                </View>
            </View>
        </View>;
    }


    getDateStr(date = this.props.date) {
        const format = 'MMM D,Y';
        const dateInstance = date instanceof Date
            ? date
            : this.getDate(date);

        if (typeof this.props.getDateStr === 'function') {
            return this.props.getDateStr(dateInstance);
        }
        return Moment(dateInstance).format(format);
    }
    renderSwitch() {
        switch (this.props.type) {
            case 'checkbox':
                return <Switch
                    name={this.props.name}
                    placeholder = {!this.state.focus ? (this.props.state.errors[this.props.name] ?this.props.state.errors[this.props.name] :this.props.label) :''}
                    placeholderTextColor = {this.props.state.errors[this.props.name] ? "#ff7584" :"#3492f4"}
                    autoCapitalize = "none"
                    value={this.props.value===1}
                    multiline={this.props.multiline}
                    numberOfLines={this.props.numberOfLines}
                    onValueChange={value=>{
                        this.props.onChangeText((value===true ? 1 : 0))
                    }}
                    blurOnSubmit={!this.props.multiline}
                    keyboardType={this.props.type==='number' ? 'numeric' :'default'}
                    style={[commonStyles.input]}
                    onFocus={e=>this.setState({focus:true})}
                    onBlur={ e=>this.props.onBlur || this.setState({focus:false})}
                    secureTextEntry={this.props.type==='password'}

                />;
            case 'date':
                return  <DatePicker
                            iconSource={
                                {
                                    uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABdUlEQVRoge2ZrU7DUBhAjwAFbob3QKDA8/MEEEIWBgIzngQslheYwAKWYAgJwSOYQCAQBBKgG6Jtegu3671Lbu/X5TvJzdau4pysd0v6gaL4sgJcAG/AJ3AL7EQ1moIu8A2MLessopcX88Ad9oh8bUez86QD3FMdchNPrZ4eMARWs+NJMe8xBF04BEbZ2jTOV8W8Ni3owj6QkEb0LZ/bYgaN2TlSF5FjxnwBy+HV3HGNyOmQ/pp1Q0r5Yu6JuogtYC17PxdSyhefiH523XNoKV+miRiR3oZi8NkTxxQRR4G9vNAIKWiEFDRCChohBY2QgkZIQSOk4BsxRiPCoBFS0AgpaIQUZiKih/vDM/Mf+yCwlxeLpAPHVkcAbFDcJnsTrhMdAXBKMURJsMeI3RMmj5QnQn9jWhGxRCr4gz2mFREAuxSiVeNgsXvC5JyycEI54gNh84kqhvz/Bh6AE2AdWIinVo85i3vKXq+BS+AKeGncSJkRfgFMqRfR7DFlLQAAAABJRU5ErkJggg==\n'
                                }
                            }
                            date={this.props.value}
                            mode="date"
                            getDateStr = {this.getDateStr}
                            format="YYYY-MM-DD"
                            disabled={this.state.started}
                            onDateChange={(date) => {this.props.onChangeText(date);}}
                            name={this.props.name}
                            placeholder = {!this.state.focus ? (this.props.state.errors[this.props.name] ?this.props.state.errors[this.props.name] :this.props.label) :''}
                            placeholderTextColor = {this.props.state.errors[this.props.name] ? "#ff7584" :"#3492f4"}
                            autoCapitalize = "none"
                            multiline={this.props.multiline}
                            numberOfLines={this.props.numberOfLines}
                            blurOnSubmit={!this.props.multiline}
                            keyboardType={this.props.type==='number' ? 'numeric' :'default'}
                            height={500}
                            style={[{
                                flex:1,
                                backgroundColor:'#fff',
                                borderBottomWidth:1,
                                borderColor:'#b4b4b4',
                                width:'100%',
                                alignItems:'flex-start',
                                justifyContent:'flex-start',
                                color:'#242424'
                            }, ]}
                            onFocus={e=>this.setState({focus:true})}
                            onBlur={ e=>this.props.onBlur || this.setState({focus:false})}
                            secureTextEntry={this.props.type==='password'}
                            display={'inline'}
                            customStyles={{
                                dateInput:{
                                    marginLeft:10,
                                    alignItems: 'flex-start',
                                },
                                placeholderText:{
                                    fontSize:20
                                },
                                dateText:{
                                    fontSize:20
                                },
                            }}
                        />;
            case 'select':
                return <MultiPlatformPicker
                            style={[commonStyles.selectItem,styles.select]}
                            titleStyle={{
                                fontSize:20,
                                color: '#000'
                            }}
                            placeholderStyle={{
                                fontSize:20,
                                color: '#c9c9c9'
                            }}
                            onChange={(name,value)=>{this.props.onChangeText(value)}}
                            values={this.props.field.data}
                            valueKey={'id'}
                            labelKey={'name'}
                            value={(this.props.value)}
                            name={this.props.name}
                            label={this.props.label}
                        />;
            case 'stock':
                return <StockInput
                        style={[commonStyles.selectItem,styles.select]}
                        onChange={(name,value)=>{this.props.onChangeText(value)}}
                        value={(this.props.value)}
                        name={this.props.name}
                        label={this.props.label}
                    />;
            default:
                return <Input
                    name={this.props.name}
                    placeholder = {!this.state.focus ? (this.props.state.errors[this.props.name] ?this.props.state.errors[this.props.name] :this.props.label) :''}
                    placeholderTextColor = {this.props.state.errors[this.props.name] ? "#ff7584" :"#3492f4"}
                    autoCapitalize = "none"
                    value={this.props.value}
                    multiline={this.props.multiline}
                    numberOfLines={this.props.numberOfLines}
                    onChangeText={value=>this.props.onChangeText(value)}
                    blurOnSubmit={!this.props.multiline}
                    keyboardType={this.props.type==='number' ? 'numeric' :'default'}
                    style={[commonStyles.input, this.props.inputStyles]}
                    errorStyle={{ color: 'red' }}
                    errorMessage={this.props.error}
                    onFocus={e=>this.setState({focus:true})}
                    onBlur={ e=>this.props.onBlur || this.setState({focus:false})}
                    secureTextEntry={this.props.type==='password'}

                />
        }
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

    select:{
        padding:0,
        alignItems:'flex-start',
        textAlign:'left',
        backgroundColor:'transparent',
        width:'100%',
        // marginLeft: 20,
        borderBottomWidth:1,
        borderColor:'#b4b4b4',
        justifyContent:'flex-start',
        color:'#242424',
        paddingBottom:10
    }
});

