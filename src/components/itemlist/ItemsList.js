import React from 'react';
import {setToken} from '../../actions/auth';
import {connect} from 'react-redux';
import {
    View,
    StyleSheet,
    Alert,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    TouchableHighlight,
    TouchableOpacity,
    Text
} from 'react-native';
import {get} from '../../api/main';
import {MyText} from '../views/Base';
import {normalizeFont} from '../../functions/frontend';
import commonStyles from '../../screens/styles';
import {SearchBar} from 'react-native-elements';
import Filters from "./Filters";

class ItemsList extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            items:[],
            loading: false,
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            search: '',
            filters: this.props.filters
        };
        this.renderItem = this.renderItem.bind(this);
        this.updateSearch = this.updateSearch.bind(this);
        this.applyFilter = this.applyFilter.bind(this);
    }



    componentDidMount() {


        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.makeRemoteRequest();
        });
    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
        this.focusListener.remove();
    }

    makeRemoteRequest = (url=false) => {
        const { page, seed } = this.state;
        url = url || this.props.url;
        this.setState({ loading: true });
        url = this.addFiltersToUrl(url);
        url = this.addSearchToUrl(url);


        get(url,this.props).then(result=>{
            if(result.error || result.message){
                Alert.alert(
                    'Error',
                    result.error || result.message,
                    {cancelable: false},
                );
                return false;
            }
            this.setState({
                items: page === 1 ? result : [...this.state.items, ...result],
                error: result.error || null,
                loading: false,
                refreshing: false
            });
        });
    };

    addSearchToUrl = (url)=>{
        if(!this.state.search)
            return url;

        let query = `%${this.state.search}%`
        url =  url.indexOf("?")!==-1 ? `${url}&${this.props.search}=${query}` : `${url}?${this.props.search}=${query}`;

        return url;
    }
    addFiltersToUrl = (url)=>{


        this.state.filters.forEach(filter=>{

            filter.values.forEach(value=>{
                if(value.selected && value.value!==''){
                    let query = value.value
                    url =  url.indexOf("?")!==-1 ? `${url}&filter[${filter.name}]=${query}` : `${url}?filter[${filter.name}]=${query}`;
                }
            })
        })


        return url;
    }

        updateSearch(text){
            if(text instanceof Object){
                text.preventDefault();
                text = this.state.search;
            }

            this.setState({
                search: text,
                page: 1,
            }, () => {

                this.makeRemoteRequest();

            });
        }


        applyFilter=(name,value)=>{

            let filters = [...this.state.filters];


            filters = filters.map(filter=>{
                    filter.values = filter.values.map(filValue=>{
                        if(value===filValue.value && filter.name === name){
                            filValue.selected=true;
                        }else{
                            if(filter.name===name){
                                filValue.selected=false;
                            }
                        }
                        return filValue
                    });
                    return filter;
            })



            this.setState({
                page: 1,
                filters:filters
            }, () => {

                this.makeRemoteRequest();

            });


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
        this.setState(
            {
                page: this.state.page + 1
            },
            () => {
                this.makeRemoteRequest();
            }
        );
    };



    render() {
        return (
            <SafeAreaView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}
            ><View>
                <View style={{flexDirection:"row", justifyContent:'flex-end'}}>
                    {this.props.createUrl&&
                        <TouchableOpacity style={[commonStyles.button,{margin:10}]}
                                          onPress={e=>{this.props.navigation.navigate(this.props.itemClass,{
                                              pictures:this.props.pictures,
                                              sketches:this.props.sketches,
                                              fields:this.props.fields,
                                              updateUrl:this.props.updateUrl,
                                              createUrl:this.props.createUrl,
                                          })}}
                        >
                            <Text style={{color:'#fff'}}>Create New</Text>
                        </TouchableOpacity>
                    }

                </View>
                <FlatList
                    data={this.state.items}
                    renderItem={this.renderItem}
                    keyExtractor={(item,index) =>  index.toString()}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListFooterComponent={this.renderFooter}
                    ListHeaderComponent={this.props.renderHeader ? this.props.renderHeader : this.renderHeader}
                    // onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    ListEmptyComponent={<View style={{alignItems:'center'}}><Text>No data found</Text></View>}
                    // onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={50}
                />
            </View>
            </SafeAreaView>
        )
    }



    renderHeader = () => {


        return <View >
                    <SearchBar
                    placeholder="Type Here..."
                    onChangeText={this.updateSearch}
                    onSubmitEditing={this.updateSearch}
                    value={this.state.search}
                    round
                    lightTheme
                    />
                    <Filters filters = {this.state.filters} applyFilter={this.applyFilter}/>
            </View>;
    };


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

    renderItem=({item, separators}) => (
        <TouchableHighlight
            underlayColor = {'#fff'}
            style={styles.item}
            onPress={e=>{this.props.navigation.navigate(this.props.itemClass,{
                item:item,
                id:item.id,
                pictures:this.props.pictures,
                sketches:this.props.sketches,
                fields:this.props.fields,
                updateUrl:this.props.updateUrl,
            })}}
        >
            <View style={{
                flex:1,
                flexDirection:'row',
                justifyContent:'space-between',
                flexWrap: 'wrap'
            }}>
                {this.props.fields && this.props.fields.map((field,index)=> <MyText key={index} style={styles.textItem}>{item[field.name ? field.name:field]}</MyText>)}
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: 'white',
        flex: 1
    },
    item:{
        backgroundColor: '#2196f3',
        margin:10,
        padding: 10,
        borderRadius : 10,
        flex:1,
    },
    textItem:{
        fontSize:normalizeFont(15),
        color:'#fff'
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
export default connect(mapStateToProps, mapDispatchToProps)(ItemsList);
