import {StyleSheet} from 'react-native';
import {normalizeFont} from '../../functions/frontend';

import {
    Dimensions,
} from 'react-native';

const win = Dimensions.get('window');
export default  styles = StyleSheet.create({
    scrollView: {
        flex: 1
    },
    item:{
        backgroundColor: '#f9f9f9',
        margin:10,
        padding: 10,
        borderRadius : 10,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    orderItem:{
        backgroundColor: '#2196f3',
        margin:10,
        padding: 25,
        borderRadius : 10,
        flex:1,
        flexWrap: 'wrap',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        alignContent: 'center',
    },
    headerTitleContainer: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginLeft:10,
        marginRight:10,
    },
    titleItem:{
        alignSelf:'center',
        color:'#fff',
    },
    title:{
        fontSize:normalizeFont(15),
    },
    title2:{
        fontSize:normalizeFont(20),
    },
    text:{
        fontSize:normalizeFont(10),
    },

    buttonWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    secondText: {
        fontSize: normalizeFont(15),
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        width:300,
        height:45,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center'
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
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:10,
        marginBottom:20,
        width:'25%',
        borderRadius:30,
    },
    buttonBigContainer: {
        height:win.height*0.2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin:3,
        marginBottom:18,
        width:win.width*0.3,
        borderRadius:30,
    },
    materialButton: {
        backgroundColor: "#ee8707",

    },
    drawingsButton: {
        backgroundColor: "#eee651",

    },
    loginButton: {
        backgroundColor: "#00b5ec",
    },
    cancelButton: {
        backgroundColor: "#ec4a2b",
    },
    loginText: {
        color: 'white',
    },

    timerButton: {
        // height:win.height*0.2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:10,
        marginBottom:20,
        // width:win.width*0.3,
        borderRadius:50,
    },
    timerText:{
        fontSize:normalizeFont(20),
    },
    startButton: {
        backgroundColor: "#209c34",
    },
    stopButton: {
        backgroundColor: "#9c3728",
    },
            dateIcon: {
                position: 'absolute',
                    left: 0,
            },
            dateText: {
                fontSize: normalizeFont(10),
            },
    datepicker:{
        borderRadius:5,
        borderColor: '#000',
        borderWidth:1,
    }
});
