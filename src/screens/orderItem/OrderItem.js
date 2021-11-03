// Imports: Dependencies
import React  from 'react';
import {
    View,
    Platform,
    Alert,
    TouchableHighlight,
    FlatList,
    ActivityIndicator,
    Dimensions, ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import {setToken} from '../../actions/auth';
import {get, postForm} from '../../api/main';
import BackgroundTimer from "react-native-background-timer";
import {HHMMSStoSeconds, toHHMMSS} from '../../functions/time';
import DatePicker from '../../components/datepicker/datepicker';
import EditWithPassword from '../../components/EditWithPassword';
import styles from './styles';
import {MyText} from '../../components/views/Base';
import Moment from 'moment';
import {NavigationActions} from 'react-navigation';

class OrderItem extends React.Component {


    constructor(props) {
        super(props);

        this.makeRemoteRequest = this.makeRemoteRequest.bind(this);
        this.getTotalUserTime = this.getTotalUserTime.bind(this);
        this.getWorkflowList = this.getWorkflowList.bind(this);

        this.order = this.props.navigation.state.params.item;

        this.state={
            seconds: this.order.workflow  ?  HHMMSStoSeconds(this.order.workflow.log_time) : 0,
            workflow_id:this.order.workflow ? this.order.workflow.id : false,
            totalTime:0,
            passwordModal:false,
            password:'',
            started:false,
            setCurrentTime:[],
            loading:false,
            refreshing:false,
            win:Dimensions.get('window'),

        };


    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.navigation.state.params.id!==prevProps.navigation.state.params.id){
            this.order = this.props.navigation.state.params.item;
            this.setState({
                seconds: this.order.workflow  ?  HHMMSStoSeconds(this.order.workflow.log_time) : 0,
                workflow_id:this.order.workflow ? this.order.workflow.id : false,
                totalTime:0,
                passwordModal:false,
                password:'',
                started:false,
                setCurrentTime:[],
                loading:false,
                refreshing:false,
                win:Dimensions.get('window'),
            },()=>{
                this.makeRemoteRequest();
            });
        }
    }


    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.makeRemoteRequest();

        });


    }

    makeRemoteRequest = () => {
        this.getTotalUserTime();
        this.getWorkflowList();
        if(this.order.workflow&&this.order.workflow.log_status===1){
            let duration = Moment.duration(Moment().diff(this.order.workflow.start_time));
            let seconds = duration.asSeconds() + HHMMSStoSeconds(this.order.workflow.log_time);
            this.setState({seconds:seconds},()=>{
                this.startTimer();
            });

        }
    };

    getTotalUserTime(){
        const order = this.order;

        const { page, seed } = this.state;
        const url = 'order/api/order/workflow-get-time?id='+order.order_id;
        this.setState({ loading: true });
        get(url, this.props).then(result=>{

            if(result.totalTime){
                this.setState({
                    error: result.error || null,
                    totalTime: (parseInt(result.totalTime)>0) ? parseInt(result.totalTime) : 0
                })
            }

        });
    }

    getWorkflowList(){
        const order = this.order;

        const url = 'order/api/order/workflow-list';
        this.setState({ loading: true });
        postForm(url, {
            expandRowKey:order.order_id
        }, true,this.props).then(result=>{

            this.setState({
                workflows: result,
                refreshing:false,
                loading: false,
            })
        });
    }


    setUserTime(url,params){
        return postForm(url,params,true,this.props).then(result=>{
            return result
        });
    }


    onStart = () => {
        this.setUserTime('order/api/order/start-time-workflow',{
            order_id:this.order.order_id,
            workflow_id:this.state.workflow_id,
            start_time:Moment().format('Y-MM-D H:mm:ss')
        }).then(result=>{
            result = JSON.parse(result);
            if(result.error){
                Alert.alert(
                    'Error',
                    result.error,
                    {cancelable: false},
                );
                return false;
            }
            if(result.workflow && result.workflow.workflow_id){
                this.setState({workflow_id:result.workflow.workflow_id})
            }
            this.startTimer();
        });
    };




    startTimer(){
        this.setState({
            started:true,
        });
        if (Platform.OS ==="ios") {
            BackgroundTimer.start();
        }
        this.tenSeconds = this.state.seconds;
        this._interval = BackgroundTimer.setInterval(() => {
            this.setState({
                seconds: this.state.seconds + 1,
            },()=>{
                if(this.state.seconds-this.tenSeconds===10){
                    // this.setCurrentTime();
                    this.tenSeconds = this.state.seconds;
                }
            });
        }, 1000);
    }

    onPause = () => {


        BackgroundTimer.clearInterval(this._interval);
        this.setState({
            started:false,
        });
        this.setUserTime('order/api/order/end-time-workflow',{
            order_id:this.order.order_id,
            workflow_id:this.state.workflow_id,
            end_time:Moment().format('Y-MM-D H:mm:ss'),
            time:toHHMMSS(this.state.seconds)
        }).then(result=>{
            result = JSON.parse(result);
            if(result.error){
                Alert.alert(
                    'Error',
                    result.error,
                    {cancelable: false},
                );
                return false;
            }
            this.getTotalUserTime();
        })


    };

    setCurrentTime(){
        this.setUserTime('order/api/order/change-time-second-workflow',{
            workflow_id:this.state.workflow_id,
            time:toHHMMSS(this.state.seconds)
        }).then(result=>{
            result = JSON.parse(result);

            if(result.error){
                Alert.alert(
                    'Error',
                    result.error,
                    {cancelable: false},
                );
                return false;
            }
        })
    }

    onSubmitEdit(e){
        e.preventDefault();
        this.setState({
            passwordModal:false,
        }, () => {
            this.setUserTime('order/api/order/edit-log-time',{
                order_id:this.order.order_id,
                workflow_id:this.state.workflow_id,
                timer:this.state.editTemp,
                password: this.state.password,
            }).then(result=>{
                result = JSON.parse(result);


                if(result.error || result.message){
                    Alert.alert(
                        'Error',
                        result.error || result.message,
                        {cancelable: false},
                    );
                    return false;
                }
                this.setState({
                    seconds:HHMMSStoSeconds(this.state.editTemp),
                    editTemp:0,
                });

            });
        });
    }

    editTime = (time) => {

        let self  = this;
        setTimeout(function () {
            self.setState({
                editTemp:time,
                passwordModal:true,
            });
        },500);

    };


    onReset = () => {
        this.setState({
            seconds: 0,
        });
        BackgroundTimer.clearInterval(this._interval);
    };

    _onLayout = event => {

    };

    render() {
        const order = this.order;
        return (
            <ScrollView style={styles.container} onLayout={this._onLayout}>
                    <View style={[styles.orderItem,
                        {
                            flex:1
                        }
                    ]}>
                                <MyText style={[styles.titleItem,styles.title]}>{order.name}</MyText>
                                <MyText style={[styles.titleItem,styles.title2]}>{order.order_number}</MyText>
                    </View>
                    <View style={[styles.headerTitleContainer,
                        {
                        flex:1,
                        justifyContent:'flex-start'
                        }
                    ]}>
                        <TouchableHighlight style={
                            [styles.buttonBigContainer,
                                styles.materialButton,
                                {
                                }
                        ]}
                                            onPress={e=>{this.props.navigation.navigate(
                                                'OrdersNavigator',
                                                {
                                                    id:this.order.order_id
                                                },
                                                NavigationActions.navigate({
                                                    routeName: 'MaterialsRequired',
                                                    params:{
                                                        id:this.order.order_id
                                                    }
                                                })
                                            )}}
                        >
                            <MyText style={[styles.titleItem,styles.title]}>Materials{"\n"}required</MyText>
                        </TouchableHighlight>
                        <TouchableHighlight style={
                            [styles.buttonBigContainer,
                                styles.drawingsButton,
                                {
                                }
                        ]}
                                            onPress={e=>{this.props.navigation.navigate(
                                                'OrdersNavigator',
                                                {
                                                    id:this.order.order_id
                                                },
                                                NavigationActions.navigate({
                                                    routeName: 'Drawings',
                                                    params:{
                                                        id:this.order.order_id
                                                    }
                                                })
                                            )}}
                        >
                            <MyText style={[styles.titleItem,styles.title]}>Drawings</MyText>
                        </TouchableHighlight>
                        <TouchableHighlight style={
                            [styles.buttonBigContainer,
                                styles.drawingsButton,
                                {
                                    backgroundColor:'#50eee6'
                                }
                        ]}
                                            onPress={e=>{this.props.navigation.navigate(
                                                'OrdersNavigator',
                                                {
                                                    id:this.order.order_id
                                                },
                                                NavigationActions.navigate({
                                                    routeName: 'Pictures',
                                                    params:{
                                                        id:this.order.order_id
                                                    }
                                                })
                                            )}}
                        >
                            <MyText style={[styles.titleItem,styles.title]}>Pictures</MyText>
                        </TouchableHighlight>
                        <TouchableHighlight style={
                            [styles.buttonBigContainer,
                                styles.drawingsButton,
                                {
                                    backgroundColor:'#9086ee'
                                }
                        ]}

                                            onPress={e=>{this.props.navigation.navigate(
                                                'OrdersNavigator',
                                                {
                                                    id:this.order.order_id
                                                },
                                                NavigationActions.navigate({
                                                    routeName: 'JobSiteRequests',
                                                    params:{
                                                        id:this.order.order_id
                                                    }
                                                })
                                            )}}
                        >
                            <MyText style={[styles.titleItem,styles.title]}>Job Site Request</MyText>
                        </TouchableHighlight>
                        <TouchableHighlight style={
                            [styles.buttonBigContainer,
                                styles.drawingsButton,
                                {
                                    backgroundColor:'#6dd6ee'
                                }
                        ]}

                                            onPress={e=>{this.props.navigation.navigate(
                                                'OrdersNavigator',
                                                {
                                                    id:this.order.order_id
                                                },
                                                NavigationActions.navigate({
                                                    routeName: 'CheckList',
                                                    params:{
                                                        id:this.order.order_id
                                                    }
                                                })
                                            )}}
                        >
                            <MyText style={[styles.titleItem,styles.title]}>Check List</MyText>
                        </TouchableHighlight>
                        <TouchableHighlight style={
                            [styles.buttonBigContainer,
                                styles.drawingsButton,
                                {
                                    backgroundColor:'#7aee70'
                                }
                        ]}

                                            onPress={e=>{this.props.navigation.navigate(
                                                'OrdersNavigator',
                                                {
                                                    id:this.order.order_id
                                                },
                                                NavigationActions.navigate({
                                                    routeName: 'JobSpecs',
                                                    params:{
                                                        id:this.order.order_id
                                                    }
                                                })
                                            )}}
                        >
                            <MyText style={[styles.titleItem,styles.title]}>Job Specs</MyText>
                        </TouchableHighlight>
                        <TouchableHighlight style={
                            [styles.buttonBigContainer,
                                styles.drawingsButton,
                                {
                                    backgroundColor:'#eea9da'
                                }
                        ]}

                                            onPress={e=>{this.props.navigation.navigate(
                                                'OrdersNavigator',
                                                {
                                                    id:this.order.order_id
                                                },
                                                NavigationActions.navigate({
                                                    routeName: 'ExteriorColors',
                                                    params:{
                                                        id:this.order.order_id
                                                    }
                                                })
                                            )}}
                        >
                            <MyText style={[styles.titleItem,styles.title]}>Exterior Colors</MyText>
                        </TouchableHighlight>
                    </View>
                    <View style={[styles.headerTitleContainer,
                        {
                            flex:1,
                        }
                    ]}>
                        <View
                            style={{
                                flex:1,
                                margin:5

                            }}
                        >
                            {(this.state.started===true) ? <TouchableHighlight style={[styles.timerButton,styles.stopButton]}
                                                                               onPress={this.onPause}
                                >
                                    <MyText style={[styles.loginText,styles.timerText]}>Stop</MyText>
                                </TouchableHighlight>:
                                <TouchableHighlight style={[styles.timerButton,styles.startButton]}
                                                    onPress={this.onStart}
                                >
                                    <MyText style={[styles.loginText,styles.timerText]}>Start</MyText>
                                </TouchableHighlight>

                            }

                        </View>
                        <DatePicker
                            customStyles={{
                                dateIcon : [styles.dateIcon,{
                                }],
                                dateInput : {
                                            },
                                dateTouchBody : {
                                },
                                dateText : [styles.dateText,{
                                }],
                            }}
                            style={[styles.datepicker,{flex:1,margin:5}]}
                            iconSource={
                                {
                                    uri:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABdUlEQVRoge2ZrU7DUBhAjwAFbob3QKDA8/MEEEIWBgIzngQslheYwAKWYAgJwSOYQCAQBBKgG6Jtegu3671Lbu/X5TvJzdau4pysd0v6gaL4sgJcAG/AJ3AL7EQ1moIu8A2MLessopcX88Ad9oh8bUez86QD3FMdchNPrZ4eMARWs+NJMe8xBF04BEbZ2jTOV8W8Ni3owj6QkEb0LZ/bYgaN2TlSF5FjxnwBy+HV3HGNyOmQ/pp1Q0r5Yu6JuogtYC17PxdSyhefiH523XNoKV+miRiR3oZi8NkTxxQRR4G9vNAIKWiEFDRCChohBY2QgkZIQSOk4BsxRiPCoBFS0AgpaIQUZiKih/vDM/Mf+yCwlxeLpAPHVkcAbFDcJnsTrhMdAXBKMURJsMeI3RMmj5QnQn9jWhGxRCr4gz2mFREAuxSiVeNgsXvC5JyycEI54gNh84kqhvz/Bh6AE2AdWIinVo85i3vKXq+BS+AKeGncSJkRfgFMqRfR7DFlLQAAAABJRU5ErkJggg==\n'
                                }
                            }
                            date={toHHMMSS(this.state.seconds)}
                            mode="countdown"
                            format="HH:mm:ss"
                            disabled={this.state.started}
                            onDateChange={(date) => {this.editTime(date);}}
                            timeZoneOffsetInMinutes={(new Date()).getTimezoneOffset()*-1}
                        />
                        <MyText style={[
                            styles.text,
                            {
                                // width: this.state.win.width*0.3
                                flex:1,
                                margin:5,

                            }
                            ]}>Total time:{toHHMMSS(this.state.totalTime)}</MyText>
                    </View>
                {this.renderWorkflowList()}
                <EditWithPassword
                    state =  {this.state}
                    setState = {this.setState.bind(this)}
                    onSubmitEdit = {this.onSubmitEdit.bind(this)}
                />
             </ScrollView>
        )
    }



    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large" />
            </View>
        );
    };
    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "90%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "5%"
                }}
            />
        );
    };

    renderWorkflowItem=({item, separators}) => (
        <TouchableHighlight
            underlayColor = {'#fff'}
            style={[styles.item,{
                width:this.state.win.width*0.8}]}

        >
            <View style={{
                marginLeft:20,
                marginRight:20,
            }}>
                <MyText style={styles.text}>Date:{item.date}</MyText>
                <MyText style={styles.text}>Start time: {item.start_time}</MyText>
                <MyText style={styles.text}>End time: {item.end_time}</MyText>
                <MyText style={styles.text}>Log time: {item.log_time}</MyText>
            </View>
        </TouchableHighlight>
    );

    renderWorkflowList=()=>{

        return (1===2) ?  <FlatList
            data={this.state.workflows}
            renderItem={this.renderWorkflowItem}
            keyExtractor={(item, index) => 'list-item-'+index}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            // onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            // onEndReached={this.handleLoadMore}
            onEndReachedThreshold={50}
            scrollEnabled={true}
        /> : false;
    };

}


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
export default connect(mapStateToProps, mapDispatchToProps)(OrderItem);
