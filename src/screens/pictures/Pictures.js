import React from 'react';
import {setToken} from '../../actions/auth';
import {connect} from 'react-redux';
import {View, StyleSheet, Dimensions, Text, Alert} from 'react-native';
import ImagesLoader from '../../components/ImagesLoader';
import { TabView} from 'react-native-tab-view';

class Pictures extends React.Component {

    state={
        routes : [
            { key: 'picturesBefore', title: 'Picture before' },
            { key: 'picturesProgress', title: 'Picture progress' },
            { key: 'picturesAfter', title: 'Picture after' },
        ],
        index:0,
    };

    constructor(props) {
        super(props);
        this.orderId = this.props.navigation.state.params.id;
        this.saveImages = this.saveImages.bind(this);

    }
    saveImages=(data,thatObject,key)=>{
        Alert.alert('Success', 'Images saved');
        thatObject.setState({images:[]})
    };

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
                                return  <ImagesLoader
                                    navigation = {this.props.navigation}
                                    type={route.key}
                                    submit = {(data, thatObject)=>this.saveImages(data,thatObject,route.key)}
                                />;
                        }
                    }}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                />
            </View>
        );

    }


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
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
export default connect(mapStateToProps, mapDispatchToProps)(Pictures);
