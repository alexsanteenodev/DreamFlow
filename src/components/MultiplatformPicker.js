import React from 'react';
import {
    View,
    Text,
    Platform,
    Modal, Animated, TouchableOpacity,
    TextInput,
    Keyboard,
    KeyboardAvoidingView
} from 'react-native';
import {Icon,} from 'react-native-elements';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {Picker} from '@react-native-picker/picker';
import commonStyles from '../screens/styles';
import PropTypes from 'prop-types';
import {MyText} from './views/Base';
import Style from './datepicker/style';

// import { ORIENTATIONS } from '@env'
// const SUPPORTED_ORIENTATIONS = ORIENTATIONS ? ORIENTATIONS.split(',') : [];

class MultiPlatformPicker extends React.Component {


    constructor(props){
        super(props);

        this.setModalVisible=this.setModalVisible.bind(this);
        this.onPressMask=this.onPressMask.bind(this);
        this.onPressCancel=this.onPressCancel.bind(this);
        this.search=this.search.bind(this);

        this.state={
            modalVisible:false,
            animatedHeight: new Animated.Value(0),
            value:false,
            values:this.props.values,
            query:''
        };

    }






    setModalVisible(visible) {

        const {height, duration} = {
            height:200,
            duration:200,

        };


        // slide animation
        if (visible) {

            this.setState({modalVisible: visible});
            let self = this;
            return Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: height,
                    duration: duration
                }
            ).start();
        } else {
            return Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: 0,
                    duration: duration
                }
            ).start(() => {
                this.setState({modalVisible: visible});
            });
        }
    }

    onPressMask(e) {
        this.props.onChange(this.props.name,this.state.value);
        this.setModalVisible(false);
    }
    onPressCancel() {

        this.setModalVisible(false);
    }
    componentDidMount() {
        let valueItem =(this.props.values && this.props.values.length && this.props.valueKey) ? this.props.values[0][this.props.valueKey] : (this.props.values && this.props.values[0]&&this.props.values[0].value ?  this.props.values[0].value : false)

        if(this.props.value?.id){
            valueItem = this.props.value.id
        }

        this.setState({
            value:valueItem
        })
    }


    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(JSON.stringify(prevProps.values)!==JSON.stringify(this.props.values)){
            this.setState({values:this.props.values})
        }
    }

    search(value){



        this.setState({query:value});


        if(!value){
            this.setState({
                values:this.props.values
            });
            return false;
        }

        let newValues = [...this.state.values].filter(item=>{
            return item.name && item.name.toLowerCase().indexOf(value.toLowerCase())!==-1
        });



        let valueItem =(newValues[0] && this.props.valueKey) ? newValues[0][this.props.valueKey] : (newValues[0]&&newValues[0].value ?  newValues[0].value : false)
        this.setState({
            values:newValues,
            value:valueItem
        });

    }

    getTitleElement() {
        if(!this.props.value){
            return (
                <MyText style={[this.props.placeholderStyle]}>
                    {`Select ${this.props.label||this.props.name} `}
                </MyText>
            );
        }
        // console.log('this.props.value',this.props.value)
        return (
            <MyText style={[this.props.titleStyle]}>
                {(this.props.value && this.props.value.name) ? this.props.value.name : this.props.value}
            </MyText>
        );
    }

    render(){
        return (
            Platform.OS==='ios' ?
                <TouchableOpacity style={this.props.style}  onPress={e=>{this.setModalVisible(true)}}>
                    <View style={{flex:1,flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                        <AntIcon style={{marginLeft:5,marginRight:5}} name={'caretdown'}/>
                        {this.getTitleElement()}
                    </View>
                    <Modal
                        transparent={true}
                        animationType="none"
                        visible={this.state.modalVisible}
                        //supportedOrientations={SUPPORTED_ORIENTATIONS}
                        onRequestClose={() => {console.log('onRequestCloses');this.setModalVisible(false);}}
                    >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={{
                                flex: 1,
                                // alignItems: 'flex-end',
                                // flexDirection: 'row',
                                // backgroundColor: '#00000077'
                            }}
                        >
                        <TouchableOpacity
                                activeOpacity={1}
                                style={{
                                    flex: 1,
                                    alignItems: 'flex-end',
                                    flexDirection: 'row',
                                    backgroundColor: '#00000077'
                                }}
                                onPress={this.onPressMask}
                            >
                            </TouchableOpacity>
                                <Animated.View
                                style={[{height: this.state.animatedHeight, backgroundColor:'#ffffff',flex:1}]}
                            >
                                    <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft:10,marginRight:10}}>
                                        <Icon name={'cancel'} onPress={this.onPressCancel} size={35}/>
                                        <TextInput
                                            onChangeText={this.search}
                                            value={this.state.query}
                                            placeholder={'Type to search...'}
                                            style={[commonStyles.input,{
                                            marginLeft:10,
                                            marginRight:10,
                                            borderBottomWidth:1,
                                            borderBottomColor:'#d5d5d5',
                                            // borderRadius:3,
                                            // padding:10,
                                            // backgroundColor:'#ebebeb',
                                        }]}/>
                                        <Icon name={'check'} onPress={this.onPressMask} size={35}/>
                                    </View>
                                <Picker
                                    selectedValue={this.state.value}
                                    style={{flex:1}}
                                    onValueChange={(itemValue, itemIndex) =>
                                       this.setState({value:itemValue})
                                    }>
                                        {(this.state.values && Array.isArray(this.state.values)) && this.state.values.map((value,index)=>{
                                            let label = this.props.labelKey? value[this.props.labelKey] : (value.name ?  value.name : value);
                                            let valueItem = this.props.valueKey? value[this.props.valueKey] : (value.value ?  value.value : value);
                                            return <Picker.Item key={index} label={label} value={valueItem} />
                                        }
                                    )}
                                </Picker>
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </Modal>
                </TouchableOpacity>
                    :
                    <View style={this.props.style}>
                        <Picker
                            // selectedValue={this.state.language}
                            style={{
                                width:'100%',
                            }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.props.onChange(this.props.name,itemValue)
                            }
                            selectedValue={this.props.value}
                        >
                            {this.state.values.map((value,index)=>(<Picker.Item key={index} label={value} value={value} />)
                            )}
                        </Picker>
                    </View>
        );
    };

}
MultiPlatformPicker.defaultProps = {
    style: {},
    titleStyle: {},
};

MultiPlatformPicker.propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    titleStyle:PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
export default MultiPlatformPicker;
