import React  from 'react';
import {
    ActivityIndicator, Alert,
 FlatList, SafeAreaView,TouchableHighlight, View, Dimensions, Image, Modal,TouchableOpacity,TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import {setToken} from '../../actions/auth';
import {setCartWarehouse,setCartSupply,setOrderId} from '../../actions/cart';
import {get, postForm} from '../../api/main';
import {TabBar, TabView} from 'react-native-tab-view';
import { Icon,SearchBar } from 'react-native-elements'
import {normalizeFont} from '../../functions/frontend';
import styles from './styles';
import {MyText} from '../../components/views/Base';
import EditWithPassword from '../../components/EditWithPassword';
import ProductList from '../../components/ProductList';
const win = Dimensions.get('window');

import { ORIENTATIONS } from '@env'
import AddToCartModal from '../../components/AddToCartModal';
const SUPPORTED_ORIENTATIONS = ORIENTATIONS ? ORIENTATIONS.split(',') : [];


class MaterialsRequired extends React.Component {


    constructor(props) {
        super(props);

        this.id = this.props.navigation.state.params.id;

        this.state={
            materials:[],
            order_products:[],
            loading: false,
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            routes : [
                { key: 'materials', title: 'Materials required' },
                { key: 'order_products', title: 'Order products' },
            ],
            index:0,
            search:'',
            imageModal:'',
            addToCartModal : false,
            cartQuantity : '0',
            cartProduct:false,
            passwordModal:false,
            tempDeleteProduct:false,
            password:'',

        };

        this.updateSearch= this.updateSearch.bind(this);
        this.addToCart= this.addToCart.bind(this);

    }


    componentDidMount() {

        let self = this;

        if(this.props.orderId && this.id!==this.props.orderId &&( Object.keys(this.props.supplyItems).length>0 || Object.keys(this.props.warehouseItems).length>0 ) ){
            Alert.alert('Warning',
                'You have uncompleted order, please remove products from cart or complete the order',
                [
                    {
                        text: 'Ok',
                        onPress: () => self.props.navigation.navigate('Main'),
                    },
                ],
            )
        }
        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        this.getMaterials();
    };
    getMaterials = () => {
        const { page, seed } = this.state;
        let searchString = this.state.search ?
            '&StockSearch[search]='+ this.state.search
            : '';

        const url = 'order/api/order/materials-required?id='+this.id+'&page='+this.state.page+searchString;

        this.setState({ loading: true });

        get(url, this.props).then(result=>{

            if(result.error || result.message){
                Alert.alert(
                    'Error',
                    result.error || result.message,
                    {cancelable: false},
                );
                this.setState({ error, loading: false });
                return false;
            }
            this.setState({
                materials: page === 1 ? result.materials : [...this.state.materials, ...result.materials],
                order_products: result.order_products,
                error: result.error || null,
                loading: false,
                refreshing: false,
            });
        });
    };

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

        this.setState(
            {
                page: this.state.page + 1,
                // refreshing: true,
                // loading: true
            },
            () => {
                this.makeRemoteRequest();
            }
        );
    };


    deleteOrderProduct(e,item){
        e.preventDefault();
        let self  = this;
        self.setState({
            passwordModal:true,
            tempDeleteProduct:item
        });
    }

    onSubmitEdit(e){
        e.preventDefault();

        const url = 'order/api/order/changequantityorder';

        this.setState({
            passwordModal:false,
        }, () => {
            postForm(url, {
                product_id: this.state.tempDeleteProduct.product_id,
                warehouse_id: this.state.tempDeleteProduct.warehouse_id,
                quantity_old: this.state.tempDeleteProduct['Quantity'],
                quantity: 0,
                order_id: this.id,
                password: this.state.password,
            },true, this.props).then(result=>{
                this.setState({
                    tempDeleteProduct:false,
                });

                result = JSON.parse(result);

                if(result.error || result.message){
                    Alert.alert(
                        'Error',
                        result.error || result.message,
                        {cancelable: false},
                    );
                    return false;
                }

                if(result.success){
                    Alert.alert(
                        'Success',
                        'The order has been successfully deleted'
                    );
                    this.makeRemoteRequest();
                }
            });
        });




    }


    showImage(e,image){
        e.preventDefault();

        this.setState({imageModal:image});
    }
    showAddToCartModal(e,item){
        e.preventDefault();

        item.quantity = 0;
        this.setState({
            addToCartModal:true,
            cartProduct:item
        })

    }
    addToCart(e,cartQuantity=false){
        e.preventDefault();

        let availableQuantity = parseInt(this.state.cartProduct['Quantity']);
        let needQuantity = parseInt(cartQuantity ? cartQuantity : this.state.cartQuantity);

        if(this.props.supplyItems[this.state.cartProduct['product_id']]){
            availableQuantity -=this.props.supplyItems[this.state.cartProduct['product_id']].quantity;
        }

        if(this.props.warehouseItems[this.state.cartProduct['product_id']]){
            availableQuantity -=this.props.warehouseItems[this.state.cartProduct['product_id']].quantity;
        }

        availableQuantity = Math.max(0,availableQuantity);

        let warehouseItemsQuantity =(availableQuantity>=needQuantity) ?  needQuantity : (availableQuantity);
        let supplyItemsQuantity =(availableQuantity>=needQuantity) ?  0 : (needQuantity-availableQuantity);
        let supplyItems = this.props.supplyItems;
        let warehouseItems = this.props.warehouseItems;

        if(warehouseItemsQuantity>0){

            let warehouseProduct = Object.assign({},this.state.cartProduct);


            delete warehouseProduct.quantity;
            delete warehouseProduct.Quantity;

            if(!warehouseItems[warehouseProduct['product_id']]){
                warehouseItems = Object.assign(warehouseItems,
                    {
                        [warehouseProduct['product_id']]:warehouseProduct
                    }
                )
            }
            warehouseItems[warehouseProduct['product_id']].quantity= (warehouseItems[warehouseProduct['product_id']].quantity) ?
                warehouseItems[warehouseProduct['product_id']].quantity+warehouseItemsQuantity:warehouseItemsQuantity;
            this.props.setCartWarehouse(warehouseItems);

        }
        if(supplyItemsQuantity>0){
            let supplyProduct = Object.assign({},this.state.cartProduct);
            delete supplyProduct.quantity;
            delete supplyProduct.Quantity;

            if(!supplyItems[supplyProduct['product_id']]){
                supplyItems = Object.assign(supplyItems,
                    {
                        [supplyProduct['product_id']]:supplyProduct
                    }
                )
            }
            supplyItems[supplyProduct['product_id']].quantity=supplyItems[supplyProduct['product_id']].quantity
                ? supplyItems[supplyProduct['product_id']].quantity + supplyItemsQuantity
                :supplyItemsQuantity;

            this.props.setCartSupply(supplyItems);
        }

        this.setState({
            addToCartModal:false,
            cartProduct:false
        },() => {
            Alert.alert('Success', 'Product successfully added');
        });

        this.props.setOrderId(false);
        this.props.setOrderId(this.id);

    }

    updateSearch(text){
        if(text instanceof Object){
            text.preventDefault();
            text = this.state.search;
        }

        this.setState({
            page: 1,
            search: text,
            refreshing: true,
            loading: true,
            materials: [],
        }, () => {
            this.getMaterials();
        });
    }


    render() {
        return (
            <SafeAreaView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}
            ><TabView
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
                            getLabelText={({ route }) =>(route.key==='materials') ?route.title :  route.title+(' ('+this.state[route.key].length+')')}
                        />
                    }
                />
                {this.renderImageModal()}
                <AddToCartModal
                    addToCartModal = {this.state.addToCartModal}
                    setState = {this.setState.bind(this)}
                    addToCart = {this.addToCart.bind(this)}
                />
            </SafeAreaView>
        )
    }



    renderTabContent(route){



        return (route==='materials')? <ProductList
            items={ this.state.materials}
            state={ this.state}
            setState={ this.setState.bind(this)}
            updateSearch={ this.updateSearch}
            showImage={ this.showImage}
            showAddToCartModal={ this.showAddToCartModal}
            onSubmitEdit={ this.onSubmitEdit.bind(this)}
            deleteProduct={this.deleteOrderProduct.bind(this)}

        /> : <FlatList
            data={ this.state.order_products}
            renderItem={({item}) => this.renderMaterial(item,'order_products')}
            keyExtractor={(item, index) => 'list-item-'+index}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            // onRefresh={this.handleRefresh}
            // refreshing={this.state.refreshing}
            // onEndReached={this.handleLoadMore}
            // onEndReachedThreshold={0.5}
        />;


    }

    renderHeader = () => {
        return <SearchBar
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            onSubmitEditing={this.updateSearch}
            value={this.state.search}
            round
            lightTheme
        />;
    };
    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 30,
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

    renderMaterial=(item, type) => (
        <View    style={styles.item}>
            <TouchableHighlight
                underlayColor = {'#fff'}

                style={{
                    flex: 0.2,
                    alignSelf: 'stretch',
                    marginRight:30,

                }}
                onPress={e=>this.showImage(e,item.Image)}>
            <Image
                style={{
                    flex: 1,
                    // alignSelf: 'stretch',
                }}
                source={{uri:item.Image}}
                resizeMode={'contain'}

            /></TouchableHighlight>
            <TouchableHighlight
                underlayColor = {'#fff'}
                onPress={e=>{(type==='materials') ? this.showAddToCartModal(e,item) : false}}

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
                        Object.keys(item).map((key,index)=>{

                        return(key!=='Image' && key!=='Quantity'&& key!=='quantity' && key!=='product_id'&& key!=='warehouse_id') ?
                            <MyText style={{
                                        fontSize:normalizeFont(8),
                                    }}
                                  key={index}>{key}: {item[key]}
                        </MyText> : false;

                    })}
                </View>
                <MyText style={{
                    alignSelf: 'center',
                    fontSize:normalizeFont(10),

                }}>Quantity: {item['Quantity']}</MyText>
                {(type==='order_products') ?

                    <TouchableHighlight
                        underlayColor = {'red'}
                        onPress={e=>this.deleteOrderProduct(e,item)}


                    ><Icon name={'delete'} size={50}/></TouchableHighlight>
                    : false}
                </View>
            </TouchableHighlight>
            <EditWithPassword
                state =  {this.state}
                setState = {this.setState.bind(this)}
                onSubmitEdit = {this.onSubmitEdit.bind(this)}
            />
        </View>

    );


    renderImageModal=()=> {
        let visible = (this.state.imageModal!=='' && this.state.imageModal!==false);
        return <Modal
            transparent={false}
            animationType="fade"
            visible={visible}
            supportedOrientations={SUPPORTED_ORIENTATIONS}
            onRequestClose={() => {
                this.setState({imageModal: ''});
            }}

        ><TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                this.setState({imageModal: ''});
            }}
            style={{flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop:20,
                backgroundColor: '#dcdcdc',}}
        ><View
            style={{flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop:20,
                backgroundColor: '#dcdcdc',}}
        >
            {this.state.imageModal ?
                <Image
                    style={{
                        flex: 0.5,
                        width:win.width/2,
                        // height:win.width/2,
                    }}
                    source={{uri: this.state.imageModal}}
                    resizeMode='contain'

                />
                : false}

        </View></TouchableOpacity>
        </Modal>
    };
}




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
        setOrderId: (token) => dispatch(setOrderId(token)),
    };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(MaterialsRequired);
