import React from 'react';
import {setToken} from '../../actions/auth';
import {connect} from 'react-redux';
import {
    StyleSheet,
    Dimensions,
    Text,
    Alert,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import {get, postForm} from '../../api/main';
import {addSupplyProducts, setSupplyProduct, setSupplyProducts, setWarehouseProducts} from '../../actions/main';
import {TabView} from 'react-native-tab-view';
import ProductList from '../../components/ProductList';
import {getElementByKeyFromArray} from '../../functions/main';
import AddToCartModal from '../../components/AddToCartModal';
import ImageModal from '../../components/ImageModal';

const win = Dimensions.get('window');


class SupplyCreate extends React.Component {
    // static navigationOptions = {
    //     title: 'Orders',
    // };



    constructor(props) {
        super(props);

        let tab = this.props.navigation.state.params ? this.props.navigation.state.params.tab : false;
        let routes =  [
            { key: 'supply', title: 'Supply Products' },
            { key: 'stock', title: 'Stock' },
        ];
        let index =tab ? routes.findIndex(function(item) {
            return item.key === tab
        }) : 0;

        this.state={
            routes :routes,
            tabIndex:index,
            stock_products:[],
            cartProduct:false,
            addToCartModal:false,
            loading:false,
            refreshing:false,
            page:1,
            stock:false,
            modalImages:[],
            modalVisible:[],
            modalImagesIndex:0,
            modalConfirmText:'Add to Cart',
            changeQuantityModal:false
        };

        this.qrcode = this.props.navigation.state.params ? this.props.navigation.state.params.qrcode : false;
    }


    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            if(this.qrcode){
                this.updateStockSearch(this.qrcode);
            }else{
                this.getWarehouseProducts();

            }
        });


    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    addProductToSupply(){



        if(this.qrcode && this.props.warehouseProducts && this.props.warehouseProducts.length ){
            let product = getElementByKeyFromArray(this.props.warehouseProducts,'sku',this.qrcode);
            if(product && product.product){
                product.quantity = 1;
                this.setState({
                    addToCartModal:true,
                    cartProduct:product
                },()=>{
                    this.qrcode=false;
                })
            }else{
                this.qrcode=false;
                Alert.alert('Error', 'Product not found, sku: '+this.qrcode);
            }
        }
        this.setState({loading:false, refreshing:false});

    }

    addToCart(e,quantity){
        e.preventDefault();

        this.state.cartProduct.quantity = quantity;

        if(this.state.changeQuantityModal){
            this.props.setSupplyProduct(this.state.cartProduct);
        }else{
            this.props.addSupplyProducts(this.state.cartProduct);
        }
        this.setState({
            addToCartModal:false,
            cartProduct:false,
        },() => {
            if(!this.state.changeQuantityModal){
                Alert.alert('Success', 'Product successfully added', [{
                    text: 'OK',
                    onPress: this.state.stock ? this.setState({tabIndex:0}) :   this.props.navigation.goBack()
                },
                ]);
            }
            this.setState({
                changeQuantityModal:false
            })
        });
    }



    getWarehouseProducts=()=>{

        let searchString = this.state.search ?
            '&StockSearch[search]='+ this.state.search
            : '';
        const url = 'product/api/product/stock?expand=product,warehouse&page='+this.state.page+searchString;

        this.setState({loading:true});
        get(url, this.props).then(result => {
            if (result.error || result.message) {
                Alert.alert(
                    'Error',
                    result.error || result.message,
                    {cancelable: false},
                );
                return false;
            }

            let products= (this.state.page === 1) ? result : [...this.props.warehouseProducts, ...result];
            this.props.setWarehouseProducts(products);
            this.addProductToSupply();
        }).catch(err=>{
            this.setState({loading:false, refreshing:false});

        })

    };

    handleRefresh = () => {
        this.setState(
            {
                page: 1,
                seed: this.state.seed + 1,
                refreshing: true
            },
            () => {
                this.getWarehouseProducts();
            }
        );
    };

    handleLoadMore = () => {
        if(!this.state.search){
            this.setState(
                {
                    page: this.state.page + 1,
                    // refreshing: true,
                    // loading: true
                },
                () => {
                    this.getWarehouseProducts();
                }
            );
        }
    };


    updateStockSearch=(text)=>{
        if(text instanceof Object){
            text.preventDefault();
            text = this.state.search;
        }

        this.setState({
            page: 1,
            search: text,
            refreshing: true,
            loading: true,
        }, () => {
            this.getWarehouseProducts();
        });
    };


    showAddToCartModal(e,item){
        e.preventDefault();
        let product = {...item};
        product.quantity = '1';
        this.setState({
            addToCartModal:true,
            cartProduct:product,
            modalConfirmText:'Add to cart',
            stock:true
        })
    }

    showChangeQuantityModal(e,item){
        e.preventDefault();
        let product = {...item};

        this.setState({
            addToCartModal:true,
            changeQuantityModal:true,
            modalConfirmText:'Change quantity',
            cartProduct:product,
        })
    }



    showImage(e,image){
        e.preventDefault();


        let images =[image];
        let index = 0;
        images  = images.map(function (image) {
            let newImage = {};
            newImage.url = image.uri ? image.uri : image;
            return newImage;
        });
        this.setState({
            modalImages:images,
            modalVisible:true,
            modalImagesIndex:index,
        });
    }

    deleteProduct(e,product){
        e.preventDefault();
        let removeKey  = product.product_id;

        let newItems = [...this.props.supplyProducts];
        newItems = newItems.filter((item)=>{
            return (item.product_id !==removeKey) ? item : false;
        });

        Alert.alert(
            'Are,you sure want to delete this item?',
            '',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => this.props.setSupplyProducts(newItems)},
            ],
            {cancelable: false},
        );

    }


    createSupply(e){
        const url = 'supply/api/supply-employees/create-multi-supply';
        this.setState({loadingSend:true},()=>{
            postForm(url, {
                products:this.props.supplyProducts
            }, true,this.props).then(result=>{
                if(result.error){
                    Alert.alert(
                        'Error',
                        result.error
                    );
                }
                if(result.success){
                    Alert.alert(
                        'Success',
                        result.success
                    );
                    this.props.setSupplyProducts([]);
                }
                this.setState({loadingSend:false});

            }).catch(err=>{
                console.log(err);
                this.setState({loadingSend:false});

            });
        })

    }




    render() {
        return (  <SafeAreaView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.container}
        ><TabView
                navigationState={{index: this.state.tabIndex,
                    routes:this.state.routes,
                }}
                renderScene={({ route }) => {
                    switch (route.key) {
                        default:
                            return  this.renderTabContent(route.key);
                    }
                }}
                initialLayout={{ width: Dimensions.get('window').width }}

                onIndexChange={index => {
                    this.setState({ tabIndex:index })
                }}
                swipeEnabled={false}

            />
                <AddToCartModal
                    addToCartModal = {this.state.addToCartModal}
                    setState = {this.setState.bind(this)}
                    addToCart = {this.addToCart.bind(this)}
                    initQuantity = {this.state.cartProduct.quantity}
                    confirmText={this.state.modalConfirmText}
                    title={(this.state.cartProduct && this.state.cartProduct.product) ? this.state.cartProduct.product.name+' '+this.state.cartProduct.product.description:''}
                />
                <ImageModal
                    images={this.state.modalImages}
                    imageIndex={this.state.modalImagesIndex || 0}
                    visible={this.state.modalVisible}
                    setState={this.setState.bind(this)}
                />
            </SafeAreaView>
        )
    }


    renderTabContent(route){
        return (route==='supply')? <ProductList
            items={this.props.supplyProducts}
            state={ this.state}
            setState={ this.setState.bind(this)}
            renderHeader={(this.props.supplyProducts&&this.props.supplyProducts.length) ?
                this.state.loadingSend ? <ActivityIndicator/>:<TouchableOpacity
                    style={[styles.buttonContainer,{
                        backgroundColor: "#28a745",
                        alignSelf:'center'
                    }]}
                    onPress={()=>{this.createSupply()}}
                ><Text>Apply</Text></TouchableOpacity>
                :false}
            // updateSearch={ this.updateSearch}
            showImage={ this.showImage}
            showAddToCartModal={ this.showChangeQuantityModal}
            // onSubmitEdit={ this.onSubmitEdit.bind(this)}
            deleteProduct={this.deleteProduct.bind(this)}
            fields={{
                product:{
                    name:'product',
                    inner:['name','description','ean'],

                }

            }}
        /> :<ProductList
                items={ this.props.warehouseProducts}
                state={ this.state}
                setState={ this.setState.bind(this)}
                fields={{
                    product:{
                        name:'product',
                        inner:['name','description','ean'],

                    }

                }}
                updateSearch={ this.updateStockSearch}
                search={this.state.search}
                handleLoadMore={this.handleLoadMore}
                handleRefresh={this.handleRefresh}
                showImage={ this.showImage}
                showAddToCartModal={ this.showAddToCartModal}
                // onSubmitEdit={ this.onSubmitEdit.bind(this)}
        />;
    }


}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop:10,
        // marginBottom:20,
        width:win.width*0.4,
        height:win.height*0.1,
        // margin:10,
        borderRadius:30,
    }
});


// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {

    // Redux Store --> Component
    return {
        authToken: state.authReducer.authToken,
        warehouseProducts: state.mainReducer.warehouseProducts,
        supplyProducts: state.mainReducer.supplyProducts,
    };
};

// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = (dispatch) => {
    // Action
    return {
        setToken: (logged) => dispatch(setToken(logged)),
        setWarehouseProducts: (products) => dispatch(setWarehouseProducts(products)),
        addSupplyProducts: (products) => dispatch(addSupplyProducts(products)),
        setSupplyProducts: (products) => dispatch(setSupplyProducts(products)),
        setSupplyProduct: (products) => dispatch(setSupplyProduct(products)),
    };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(SupplyCreate);
