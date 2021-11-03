import React from 'react';
import {View, SafeAreaView, ScrollView, Text} from 'react-native';
import {createAppContainer,createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { createDrawerNavigator,DrawerItems } from 'react-navigation-drawer';
import Main from '../screens/main/Main';
import OrderItem from '../screens/orderItem/OrderItem';
import MaterialsRequired from '../screens/materials-required/MaterialsRequired';
import Drawings from '../screens/drawings/Drawings';
import Pictures from '../screens/pictures/Pictures';
import JobSiteRequests from '../screens/job-site-request/JobSiteRequests';
import CheckList from '../screens/check-list/CheckList';
import JobSpecs from '../screens/job-specs/JobSpecs';
import ExteriorColors from '../screens/exterior-colors';
import JSCheckListItem from '../screens/js-checklist-item';
import Camera from '../screens/camera/Camera';
import QrCodeScanner from '../screens/camera/QrCodeScanner';
import Cart from '../screens/cart/Cart';
import AuthLoadingScreen from '../screens/auth/AuthLoading';
import SignInScreen from '../screens/auth/SignIn';
import SupplyCreate from '../screens/supply/SupplyCreate';
import Projects from '../screens/taskmanager/projects';
import MyTasks from '../screens/taskmanager/projects/myTasks';
import TaskForm from '../screens/taskmanager/tasks/TaskForm';
import TaskView from '../screens/taskmanager/tasks/TaskView';
import Logout from '../components/Logout';
import CartIcon from '../components/navIcons/CartIcon';
import WorkingIndicator from '../components/navIcons/WorkingIndicator';
import QrCodeIcon from '../components/navIcons/QrCodeIcon';
import SupplyStockIcon from '../components/navIcons/SupplyStockIcon';
import MenuIcon from '../components/navIcons/MenuIcon';
import styles from "./style";
import MyTasksIcon from '../components/navIcons/MyTasksIcon';

const AuthStack = createStackNavigator({ SignIn: SignInScreen });


const CustomDrawerContentComponent = (props) => {


    return <ScrollView>
        <SafeAreaView
            style={{
                flex: 1,
            }}
            forceInset={{top: 'always', horizontal: 'never'}}
        ><DrawerItems
                {...props}

                getLabel = {(scene) => {

                    if(scene.route.key ==='QrCodeScanner'){
                        return <QrCodeIcon navigation={props.navigation}/>
                    }
                    if(scene.route.key ==='SupplyCreate'){
                        return <SupplyStockIcon navigation={props.navigation}/>
                    }
                    if(scene.route.key ==='Cart'){
                        return <CartIcon navigation={props.navigation}/>
                    }
                    if(scene.route.key ==='Camera'){
                        return null
                    }

                    return  <View
                                style={styles.drawerButtonContainer}
                            >
                                <Text
                                    style={styles.drawerButtonText}
                                >{props.getLabel(scene)}</Text>
                            </View>
                }}
            />
            <Logout {...props}/>
        </SafeAreaView>
    </ScrollView>
};








const TaskManager = createStackNavigator({

        Projects: {screen: Projects,
            params: { route: 'Projects' },
            path: 'task-manager/projects',
            navigationOptions:  ({navigation}) => ({
                headerLeft:  (
                    <View style={{flexDirection: 'row', alignItems: 'space-between'}}>
                        <MenuIcon navigation={navigation}/>
                    </View>

                ),
                headerRight:  (
                    <View style={{flexDirection: 'row', alignItems: 'space-between'}}>
                        <MyTasksIcon />
                    </View>

                ),
            })

        },
        TaskForm: {
            screen: TaskForm,
            navigationOptions:  ({navigation}) => ({
                title: `${navigation.state.params.item ? `Edit: ${navigation.state.params.item.name}` : 'Create task'}`,
            })
        },
        TaskView: {
            screen: TaskView,
            navigationOptions:  ({navigation}) => ({
                title: `${navigation.state.params.project.name}`,
            })
        },
},{
    initialRouteName: "Projects",
    }
);


const OrdersNavigator = createStackNavigator({
    MaterialsRequired: {screen: MaterialsRequired},
    Drawings: {screen: Drawings},
    Pictures: {screen: Pictures},
    JobSiteRequests: {screen: JobSiteRequests},
    CheckList: {screen: CheckList},
    JobSpecs: {screen: JobSpecs},
        ExteriorColors: {screen: ExteriorColors},
    JSCheckListItem: {screen: JSCheckListItem},
},
    {
        headerMode:'none',
        // navigationOptions:{
        //     header:false
        // }
    }
);
const OrderItemNavigator = createStackNavigator({
        OrderItem: {
            screen: OrderItem,
            // headerMode:'none',
            navigationOptions: ({ navigation }) => ({
                title: `${navigation.state.params.item.name}`,
                // header:false
            }),
        },
        OrdersNavigator:{
            screen: OrdersNavigator,
            navigationOptions: ({ navigation }) => ({
                title: ``,
                // header:false
            }),
        },
    },

    {
        navigationOptions: ({ navigation }) => {
            return {
                title: false,
            }

        },
    }
);
const MainNavigator = createStackNavigator({
        Main: {
            screen: Main,
        },
        Order:{
            screen:OrderItemNavigator,
        }
    },
    {
        defaultNavigationOptions:  ({navigation}) => ({
            headerLeft:  (
                <View style={{flexDirection: 'row', alignItems: 'space-between'}}>
                    <MenuIcon navigation={navigation}/>
                </View>

            ),
            headerRight:  (
                <View style={{flexDirection: 'row', alignItems: 'space-around'}}>
                    {/*<MenuIcon navigation={navigation}/>*/}
                    {/*<SupplyStockIcon navigation={navigation}/>*/}
                    {/*<QrCodeIcon navigation={navigation}/>*/}
                    <MyTasksIcon />
                    <WorkingIndicator navigation={navigation}/>
                    <CartIcon  navigation={navigation}/>
                    {/*<Logout navigation={navigation}/>*/}
                </View>

            ),
        }),
    }
    );



const DrawerNavigator = createDrawerNavigator({
    Orders: MainNavigator,
    TaskManager: {screen: TaskManager},
    MyTasks: {screen: createStackNavigator(
            {
                MyTasks: {
                    screen: MyTasks,
                    navigationOptions:  ({navigation}) => {
                        return  {

                            headerLeft:  (
                                <View style={{flexDirection: 'row', alignItems: 'space-between'}}>
                                    <MenuIcon navigation={navigation}/>
                                </View>

                            ),
                        }}
                },
            },
        ),

    },

    Camera: {screen: createStackNavigator(
            {
                Camera: {
                    screen: Camera,
                    navigationOptions:  ({navigation}) => {
                        return  {

                            headerLeft:  (
                                <View style={{flexDirection: 'row', alignItems: 'space-between'}}>
                                    <MenuIcon navigation={navigation}/>
                                </View>

                            ),
                        }}
                },
            },
        ),

    },
    QrCodeScanner: {screen: createStackNavigator(
            {
                QrCodeScanner: {
                    screen: QrCodeScanner,
                    navigationOptions:  ({navigation}) => {
                        return  {

                            headerLeft:  (
                                <View style={{flexDirection: 'row', alignItems: 'space-between'}}>
                                    <MenuIcon navigation={navigation}/>
                                </View>

                            ),
                        }}
                },
            },
        ),

    },


    // Sketch: {screen: Sketch},
    Cart: {screen: Cart,},
    SupplyCreate: {
        screen: createStackNavigator(
            {
                SupplyCreate: {
                    screen: SupplyCreate,
                    navigationOptions:  ({navigation}) => {
                        return  {

                            headerLeft:  (
                                <View style={{flexDirection: 'row', alignItems: 'space-between'}}>
                                    <MenuIcon navigation={navigation}/>
                                </View>

                            ),
                        }}
                },
            },
        ),

    },
},{
    contentComponent: CustomDrawerContentComponent,
});


const  SwitchNavigator  = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingScreen,
            App: DrawerNavigator,
            Auth: AuthStack,
        },
        {
            initialRouteName: 'AuthLoading',
        }
    )
);


export default SwitchNavigator;

