import React from 'react';
import {FlatList, RefreshControl, StyleSheet, View, ActivityIndicator,Text} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        height:'100%'
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    scrollView: {
        backgroundColor: 'white',
        flex: 1
    },
});

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const ScrollListBasics =
    ({
         data,
         renderItem,
         handleLoadMore,
         loading,
         header,
         refresh
     }) => {
        const keyExtractor = (item, index) => index.toString()
        const [refreshing, setRefreshing] = React.useState(false);

        const renderFooter = () => {
            if (!loading && !refreshing && !data.length)
                return <View style={{flex:1, alignItems:'center'}}><Text>Nothing found</Text></View>;

            if(!loading)
                return null;

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

        const onRefresh = () => {
            setRefreshing(true);
            if(refresh){
                refresh().then(()=>{
                    setRefreshing(false)
                })
            }else{
                setRefreshing(false)
            }
        };

        return (
            <View style={styles.container}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    keyExtractor={keyExtractor}
                    data={data}
                    renderItem={renderItem}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0}
                    ListFooterComponent={renderFooter}
                    ListHeaderComponent={header}
                    scrollEnabled={!loading}
                />
            </View>
    );
};

export default ScrollListBasics;
