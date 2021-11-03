import React from 'react';
import {setToken} from '../actions/auth';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableHighlight,
    Text, Image,
} from 'react-native';
import {MyText} from '../components/views/Base';
import {normalizeFont} from '../functions/frontend';
import {Icon, SearchBar} from 'react-native-elements';
import EditWithPassword from './EditWithPassword';

import {
    Dimensions,
} from 'react-native';

const win = Dimensions.get('window');
class ProductList extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            items:[],
            page: 1,
            seed: 1,
            error: null,
        };

        this.renderItem = this.renderItem.bind(this);
    }

    render() {
        return (
            <FlatList
                data={this.props.items}
                renderItem={({item}) => this.renderItem(item)}
                keyExtractor={(item, index) => 'list-item-'+index}
                ItemSeparatorComponent={this.renderSeparator}
                ListFooterComponent={this.props.renderFooter ? this.props.renderFooter : this.renderFooter}
                ListHeaderComponent={this.props.renderHeader ? this.props.renderHeader : this.renderHeader}
                onRefresh={this.props.handleRefresh}
                refreshing={this.props.state.refreshing}
                onEndReached={this.props.handleLoadMore}
                onEndReachedThreshold={0}
                scrollEnabled={!this.props.state.loading}
                ListEmptyComponent={this._listEmptyComponent}
            />
        )
    }

    _listEmptyComponent=()=>(<View style={{alignItems:'center'}}><Text>Nothing found</Text></View>);

    renderHeader = () => {
        if(!this.props.updateSearch)
            return null;
        return <SearchBar
            placeholder="Type Here..."
            onChangeText={this.props.updateSearch}
            onSubmitEditing={this.props.updateSearch}
            value={this.props.state.search}
            round
            lightTheme
        />;
    };
    renderFooter = () => {
        if (!this.props.state.loading) return null;

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

    renderItem=(item) => {

        let image = item.Image ? item.Image : item.image;
        let quantity = item['Quantity'] ? item['Quantity'] : item.quantity;
        return <View    style={styles.item}>
                <TouchableHighlight
                    underlayColor = {'#fff'}

                    style={{
                        flex: 0.2,
                        alignSelf: 'stretch',
                        marginRight:30,

                    }}
                    onPress={e=>this.props.showImage(e,image)}>
                    <Image
                        style={{
                            flex: 1,
                            // alignSelf: 'stretch',
                        }}
                        source={{uri:image}}
                        resizeMode={'contain'}

                    /></TouchableHighlight>
                <TouchableHighlight
                    underlayColor = {'#fff'}
                    onPress={e=>{(this.props.showAddToCartModal) ? this.props.showAddToCartModal(e,item) : false}}

                    style={{
                        flex: 1,
                    }}
                ><View
                    style={{
                        flex: 1,
                        flexDirection:'row',
                        justifyContent: 'space-between',
                        alignItems:'center',
                    }}
                ><View
                    style={{
                        flex: 1,
                    }}
                >
                    {
                        this.props.fields ? Object.keys(this.props.fields).map((field,index)=>{
                                return  this.props.fields[field].inner

                                    ?
                                    this.props.fields[field].inner.map((innerField,index)=>{
                                        return <MyText style={{
                                            fontSize:normalizeFont(8),
                                        }}
                                                       key={index}>{innerField}: {item[field][innerField]}</MyText>;
                                    })
                                    : <MyText style={{
                                        fontSize:normalizeFont(8),
                                    }}
                                                key={index}>{key}: {item[field]}
                                    </MyText>
                            }):
                        Object.keys(item).map((key,index)=>{


                            return(key!=='Image' && key!=='Quantity'&& key!=='quantity' && key!=='product_id'&& key!=='warehouse_id') ?
                                <MyText style={{
                                    fontSize:normalizeFont(8),
                                }}
                                        key={index}>{key}: {item[key]}
                                </MyText>
                                : false;

                        })}
                </View>
                    <MyText style={{
                        alignSelf: 'center',
                        fontSize:normalizeFont(10),

                    }}>Quantity: {quantity}</MyText>
                    {(this.props.deleteProduct) &&
                        <TouchableHighlight
                            underlayColor = {'red'}
                            onPress={e=>this.props.deleteProduct(e,item)}
                        ><Icon name={'delete'} size={50}/></TouchableHighlight>}
                </View>
                </TouchableHighlight>
                {this.props.onSubmitEdit ? <EditWithPassword
                    state =  {this.props.state}
                    setState = {this.props.setState.bind(this)}
                    onSubmitEdit = {this.props.onSubmitEdit.bind(this)}
                />:false}

        </View>
    }
}

const styles = StyleSheet.create({
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
export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
