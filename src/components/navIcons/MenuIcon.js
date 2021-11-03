import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native';
import React from 'react';
import { DrawerActions} from 'react-navigation-drawer';

const MenuIcon=({navigation})=>{

    return <TouchableOpacity onPress={e=>{
                navigation.dispatch(DrawerActions.toggleDrawer());
            }}>
                <Icon name={'menu'}  size={25}/>
            </TouchableOpacity>
};
export default MenuIcon
