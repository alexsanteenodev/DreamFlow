

import React, {useEffect, useRef} from 'react';
import  {LogBox} from 'react-native';
import { PersistGate } from 'redux-persist/es/integration/react'
import { Provider } from 'react-redux';
import notifee from '@notifee/react-native';
import AsyncStorage from '@react-native-community/async-storage'
// Imports: Screens
import MainNavigator from './src/navigators/index';

// Imports: Redux Persist Persister
import { store, persistor } from './src/store/store';
import messaging from '@react-native-firebase/messaging';
import {NavigationActions} from 'react-navigation';
import Toast from 'react-native-toast-message';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});
const App: () => React$Node = () => {
    const navigator = useRef(null);

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }, []);


    const init = async()=>{
        await requestUserPermission();
    };
    useEffect(() => {
        init()
    }, []);


    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
            notifee.displayNotification({
                title: remoteMessage.notification.title,
                body:remoteMessage.notification.body,
            });
        });

        return unsubscribe;
    }, []);

    useEffect(()=>{
        const unsubscribe = messaging().onTokenRefresh(async (fcmToken) => {
           console.log('New FCM Token:', fcmToken);
            await AsyncStorage.setItem('fcmToken', fcmToken);
        });
        return unsubscribe;
    },[]);



    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            getFcmToken();
            console.log('Authorization status:', authStatus);
        }
    };
    const getFcmToken = async () => {

        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log("Your Firebase Token is:", fcmToken);
                await AsyncStorage.setItem('fcmToken', fcmToken);
            } else {
                console.log("Failed", "No token received");
            }
        }

    };


    useEffect(() => {
        // Assume a message-notification contains a "type" property in the data payload of the screen to open

        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage,
            );
            console.log(
                'navigator.current',
                navigator.current,
            );
            navigateFromPush(remoteMessage.data)
        });

        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage,
                    );
                    navigateFromPush(remoteMessage.data)
                }
            });
    }, []);



    const navigateFromPush=(data)=>{
        if(navigator.current.dispatch){

            if(data && data.task){
                navigator.current.dispatch(
                    NavigationActions.navigate({
                        routeName: 'TaskView',
                        params: {
                            item:data.task
                        },
                    }),
                );
            }
            if(data && data.projects){
                navigator.current.dispatch(
                    NavigationActions.navigate({
                        routeName: 'Projects',
                        params: data,
                    }),
                );
            }
            if(data && data.project_id){
                navigator.current.dispatch(
                    NavigationActions.navigate({
                        routeName: 'Projects',
                        params: data,
                    }),
                );
            }

        }
    };


    return (
      // Redux: Global Store
      <Provider store={store}>
          <PersistGate
              loading={null}
              persistor={persistor}
          >
              <MainNavigator
                  ref={navigator}
              />
              <Toast ref={(ref) => Toast.setRef(ref)} />
          </PersistGate>
      </Provider>
  );
};


export default App;
