import {StyleSheet} from 'react-native';
import {normalizeFont} from '../../functions/frontend';

import {
    Dimensions,
} from 'react-native';

const win = Dimensions.get('window');
export default  styles = StyleSheet.create({
    scrollView: {
        backgroundColor: 'white',
        flex: 1
    },
    item:{
        flex: 1,
        flexDirection:'row',
        backgroundColor: '#f9f9f9',
        margin:10,
        padding: 10,
        borderRadius : 10,
        justifyContent: 'flex-start',

    },
    buttonWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    secondText: {
        fontSize: 25,
    },
    mainInputContainer:{
        flexDirection: 'row',
        alignItems:'center',
        marginBottom:20,
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        width:win.width*0.4,
        height:win.height*0.2,
        flexDirection: 'row',
        alignItems:'center'
    },
    bigInput:{
        height:win.height*0.2,
        fontSize:win.height*0.1,

        alignSelf:'center',
    },
    quantityContainer:{
        justifyContent:'center',
        alignItems:'center',
    },
    quantityIconsTouch:{
        height:win.width*0.2,
        width:win.width*0.2,
        marginLeft:10,
        marginRight:10,
        justifyContent:'center',
        alignItems:'center',

    },
    quantityIcons:{
        fontSize:Math.min(win.width*0.2,win.height*0.2),

    },
    inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    inputIcon:{
        width:30,
        height:30,
        marginLeft:15,
        justifyContent: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:10,
        marginBottom:20,
        width:win.width*0.4,
        height:win.height*0.1,
        margin:10,
        borderRadius:30,
    },
    loginButton: {
        backgroundColor: "#00b5ec",
    },
    cancelButton: {
        backgroundColor: "#ec4a2b",
    },

    loginText: {
        fontSize: normalizeFont(15),
        color:'#fff'
    },
});
