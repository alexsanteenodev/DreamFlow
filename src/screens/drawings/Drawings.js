import React from 'react';
import {setToken} from '../../actions/auth';
import {connect} from 'react-redux';
import {View, StyleSheet, Dimensions, Text, TouchableHighlight,Linking} from 'react-native';
import ImagesList from '../../components/ImagesList';
import {MyText} from '../../components/views/Base';
import {normalizeFont} from '../../functions/frontend';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import {TabView} from 'react-native-tab-view';





class Drawings extends React.Component {



    constructor(props) {
        super(props);
        this.state={
            routes : [
                { key: 'drawingsAutoCAD', title: 'AutoAD' },
                { key: 'drawingsPdf', title: 'Pdf' },
                { key: 'drawingsCV', title: 'CV' },

                // { key: 'files', title: 'Files' },
            ],
            index:0,
        };
        this.orderId = this.props.navigation.state.params.id;
    }




    render() {
        return(
            <View style={{
                flex:1,
            }}>

                <TabView
                    navigationState={{index: this.state.index,
                        routes:this.state.routes,
                    }}
                    renderScene={({ route }) => {
                        switch (route.key) {
                            default:
                                return  <ImagesList
                                    navigation = {this.props.navigation}
                                    type={route.key}
                                    state={this.state}
                                    fileType={this.props.fileType}
                                    id={this.orderId}
                                    childRef={ref => (this.child = ref)}
                                    renderItem={this.renderItem}
                                />;
                        }
                    }}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                />
            </View>
        );

    }



    renderItem = (item) => {
        let image = item.item;
        return (
            <TouchableHighlight
                underlayColor = {'#fff'}
                style={styles.item}
                onPress={e=>{
                    const url = image.uri;
                    const localFile = `${RNFS.DocumentDirectoryPath}/${image.name}`;
                    const options = {
                        fromUrl: url,
                        toFile: localFile
                    };
                    RNFS.downloadFile(options).promise
                        .then(() => FileViewer.open(localFile, { showOpenWithDialog: true }))
                        .then((res) => {
                            console.log('RNFS',res)
                        })
                        .catch(error => {
                            console.log(error)
                        });
                    //
                    // Linking.openURL(image.uri).catch((err) => {
                    //     console.log(err)
                    // });
                }}
            >
                <View style={{
                    flex:1,
                    flexDirection:'row',
                    justifyContent:'space-between',
                    flexWrap: 'wrap'
                }}>
                    <MyText  style={styles.textItem}>{image.name}</MyText>
                </View>
            </TouchableHighlight>
        );
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    item:{
        backgroundColor: '#e1e1e1',
        margin:10,
        padding: 10,
        borderRadius : 10,
        flex:1,
    },
    textItem:{
        fontSize:normalizeFont(15),
        color:'#000'
    }
});


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
export default connect(mapStateToProps, mapDispatchToProps)(Drawings);
