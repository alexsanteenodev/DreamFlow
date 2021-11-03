import React  from 'react';
import {
    ActivityIndicator,
    FlatList, SafeAreaView, StyleSheet, Text, TouchableHighlight, View, Dimensions, Image, Alert,
} from 'react-native';
import { connect } from 'react-redux';
import {setToken} from '../../actions/auth';
import {setCartWarehouse,setCartSupply,setOrderId} from '../../actions/cart';
import {TabView,TabBar} from 'react-native-tab-view';
import { Icon } from 'react-native-elements'
import {postForm} from '../../api/main';
import {normalizeFont} from '../../functions/frontend';
import {MyText} from '../../components/views/Base';




class Cart extends React.Component {


    constructor(props) {
        super(props);


        this.state={
            materials:[],
            loading: false,
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            routes : [
                { key: 'warehouse', title: 'Warehouse cart' },
                { key: 'supply', title: 'Supply cart' },
            ],
            index:0,
            search:'',
            imageModal:'',
            addToCartModal : false,
            cartQuantity : '',
            cartProduct:false,
            loadingSend:false,

        };

        this.deleteProduct = this.deleteProduct.bind(this);
        this.sendOrder = this.sendOrder.bind(this);

    }


    handleRefresh = () => {
        this.setState(
            {
                page: 1,
                seed: this.state.seed + 1,
                refreshing: true
            },
            () => {
                this.makeRemoteRequest();
            }
        );
    };

    handleLoadMore = () => {
        console.warn('LOADMORE');
        this.setState(
            {
                page: this.state.page + 1
            },
            () => {
                this.makeRemoteRequest();
            }
        );
    };


    deleteProduct(e,product,type){
        e.preventDefault();
        let setMethod = (type==='supply') ? 'setCartSupply' : 'setCartWarehouse';
        let removeKey  = product.product_id;
        const { [removeKey]: deleted, ...newItems } = this.props[type+'Items'];

        this.props[setMethod](newItems);

    }


    sendOrder(e){
        e.preventDefault();
        const url = 'order/api/order/send-work-order?id='+this.props.orderId;
        this.setState({loadingSend:true},()=>{
            postForm(url, {
                warehouseItems:this.props.warehouseItems,
                supplyItems:this.props.supplyItems
            }, true,this.props).then(result=>{

                result = JSON.parse(result);
                if(result.success){
                    Alert.alert(
                        'Success',
                        'The order has been successfully sent'
                    );

                    this.props.setCartSupply({});
                    this.props.setCartWarehouse({});
                    this.props.setOrderId(false);

                }
                this.setState({loadingSend:false});

            });
        })

    }

    render() {
        return (
            <SafeAreaView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}
            >
                {this.state.loadingSend?                 <ActivityIndicator animating size="large" />
                :
                <TouchableHighlight
                    onPress={e=>this.sendOrder(e)}
                    style={[styles.buttonContainer,{
                    alignSelf:'center',
                    backgroundColor:'#27c42b',

                }]}><MyText style={{color:'#fff'}}>Send Order</MyText></TouchableHighlight>
                }
                <TabView
                    navigationState={{index: this.state.index,
                        routes:this.state.routes,
                    }}
                    renderScene={({ route }) => {
                        switch (route.key) {
                            default:
                                return  this.renderTabContent(route.key);
                        }
                    }}
                    onIndexChange={index => this.setState({ index })}
                    initialLayout={{ width: Dimensions.get('window').width }}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            // indicatorStyle={{ backgroundColor: 'white' }}
                            // style={{ backgroundColor: 'pink' }}
                            getLabelText={({ route }) => route.title+(' ('+Object.keys(this.props[route.key+'Items']).length+')')}
                        />
                    }
                />
            </SafeAreaView>
        )
    }



    renderTabContent(route){

        let self = this;
        let warehouseItems  = Object.keys(this.props.warehouseItems).map(function(key) {
            return self.props.warehouseItems[key];
        });

        let supplyItems  = Object.keys(this.props.supplyItems).map(function(key) {
            return self.props.supplyItems[key];
        });



        return (route==='warehouse')?  <><FlatList
            data={ warehouseItems}
            // renderItem={this.renderMaterial}
            renderItem={({item}) => this.renderMaterial(item,'warehouse')}
            keyExtractor={(item, index) => 'list-item-'+index}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            // onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            // onEndReached={this.handleLoadMore}
            // onEndReachedThreshold={0.5}
            ListHeaderComponent={() => (!warehouseItems.length?
                <MyText style={{alignSelf:'center'}}>The cart is empty</MyText>
                : null)
            }
        /></> : <FlatList
            data={supplyItems}
            // renderItem={this.renderMaterial}
            renderItem={({item}) => this.renderMaterial(item,'supply')}
            keyExtractor={(item, index) => 'list-item-'+index}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            ListHeaderComponent={() => (!supplyItems.length?
                <MyText style={{alignSelf:'center'}}>The cart is empty</MyText>
                : null)}
        />;


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

    renderMaterial=(item, type) => {
        return <View style={styles.item}>

                <Image
                    style={{
                        flex: 0.2,
                        alignSelf: 'stretch',
                        marginRight:30,

                    }}
                    source={{uri: item.Image}}
                    resizeMode={'contain'}

                />
           <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}
            ><View style={{
                flex: 1,
            }}>
                {
                    Object.keys(item).map((key, index) => {

                        return (key !== 'Image' && key !== 'quantity' &&key!== 'cart_quantity' && key !== 'product_id'
                            && key !== 'warehouse_id'
                        ) ?
                            <MyText style={{
                                fontSize: normalizeFont(7),

                            }}
                                  key={index}>{key}: {item[key]}</MyText> : false;

                    })}
            </View>
                <MyText style={{
                    alignSelf: 'center',
                    fontSize: normalizeFont(8),

                }}>Quantity: {item['quantity']}</MyText>
                <TouchableHighlight
                    underlayColor={'red'}
                    onPress={e=>this.deleteProduct(e,item,type)}

                ><Icon name={'delete'} size={50}/></TouchableHighlight>
            </View>

        </View>

    };



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
        width:250,
        borderRadius:30,
    },
    loginButton: {
        backgroundColor: "#00b5ec",
    },
    cancelButton: {
        backgroundColor: "#ec4a2b",
    },
});



// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {

    // Redux Store --> Component
    return {
        authToken: state.authReducer.authToken,
        supplyItems: state.cartReducer.supplyItems,
        warehouseItems: state.cartReducer.warehouseItems,
        orderId: state.cartReducer.orderId,
    };
};

// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    // Action
    return {
        setToken: (token) => dispatch(setToken(token)),
        setCartWarehouse: (item) => dispatch(setCartWarehouse(item)),
        setCartSupply: (item) => dispatch(setCartSupply(item)),
        setOrderId: (item) => dispatch(setOrderId(item)),
    };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
