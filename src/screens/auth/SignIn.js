import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {View, TouchableHighlight, Image, TextInput, Text, ActivityIndicator} from 'react-native';
import styles from './style';
import {get, postForm, sendDeviceToken} from '../../api/main';
import {setLogged, setPermissions, setToken, setUserData} from '../../actions/auth';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {MyText} from '../../components/views/Base';
import commonStyles from '../styles';
import MultiPlatformPicker from '../../components/MultiplatformPicker';

class SignInScreen extends React.Component {
    static navigationOptions = {
        title: 'Please sign in',
    };

    state = {
        email   : '',
        password: '',
        errors:{
            password:false
        },
        loading:false,
        users:[],

    };

    constructor(props) {
        super(props);

    }


    componentDidMount() {

        this.getUsers();

        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.getUsers();
        });
    }


    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({loading:true});
        let result  = await postForm('api/user/login',{
            username:this.state.email,
            password:this.state.password,
        }).catch(e=>{
            console.error(e.message);
        });

        this.setState({loading:false});

        if(result.password){
            let errors = this.state.errors;
            errors.password = result.password;
            this.setState({password:'',errors : errors})
        }
        if(result.permissions) {
            this.props.setPermissions(result.permissions);
        }
        if(result.access_token){
            this.props.setToken(result.access_token);

            if(result.user_id){
                this.props.setUserData({
                    user_id:result.user_id,
                    employee_id:result.employee_id
                })
            }



            let fcmToken = await AsyncStorage.getItem('fcmToken');
            await sendDeviceToken(fcmToken,{
                authToken:result.access_token
            });
            this.props.navigation.navigate('App');
        }

    };

    getUsers = () => {
        let searchString = this.state.search ?
            '?UserSearch[username]='+ this.state.search
            : '';
        const url = 'api/user/employees'+searchString;
        this.setState({loading: true});
        get(url).then(result => {
            if (result.error || result.message) {
                Alert.alert(
                    'Error',
                    result.error || result.message,
                    {cancelable: false},
                );
                return false;
            }

            let users = [{name:'Choose user', value:''}];

            result = result ? result.map((user,index)=>{
                return {name:user.name,value:user.username,}
            }) : [];
            this.setState({
                users: users.concat(result),
                error: result.error || null,
                loading: false,
                refreshing: false
            })
        })
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <MultiPlatformPicker
                        style={[commonStyles.selectItem,{
                            alignSelf:'center',
                            padding:0,
                            alignItems:'center',
                            textAlign:'center',
                            backgroundColor:'transparent',


                        }]}
                        onChange = {(name,value) => {
                            this.setState({[name]:value})
                        }}
                        values={this.state.users}
                        value={this.state.users.filter(obj => {
                            return obj.value === this.state.email
                        })[0] ? this.state.users.filter(obj => {
                            return obj.value === this.state.email
                        })[0].name :  'Choose user'}
                        name={'email'}

                    />
                </View>

                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={{uri: 'data:image/png;base64,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\n'}}/>
                    <TextInput style={styles.inputs}
                               placeholder={this.state.errors.password ? this.state.errors.password :  'Password'}
                               { ...((this.state.errors.password) ? {placeholderTextColor:'red'} : '') }
                               secureTextEntry={true}
                               underlineColorAndroid='transparent'
                               value={this.state.password}
                               onChangeText={(password) => this.setState({password})}/>
                </View>
                {this.state.loading ?
                    <ActivityIndicator/>
                :
                    <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={(e) => this.onSubmit(e)}>
                        <MyText style={styles.loginText}>Login</MyText>
                    </TouchableHighlight>
                }

            </View>
        );
    }


    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', 'abc');
        this.props.navigation.navigate('App');
    };
}





// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    // Action
    return {
        setToken: (token) => dispatch(setToken(token)),
        setPermissions: (token) => dispatch(setPermissions(token)),
        setUserData: (data) => dispatch(setUserData(data)),
    };
};

// Exports
export default connect(null, mapDispatchToProps)(SignInScreen);

