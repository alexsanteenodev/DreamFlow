import React from 'react';
import ItemsListTable from '../../components/ItemsListTable';

class CheckList extends React.Component {


    constructor(props) {
        super(props);
        this.orderId = this.props.navigation.state.params.id;
    }



    render() {
        return (
            <ItemsListTable
                navigation={this.props.navigation}
                orderId={this.orderId}
                url={'order/api/order-check-list?filter[order_id]='+this.orderId+'&expand=clPictures,clSketches'}
                updateUrl={'order/api/order-check-list/update?id='}
                deleteUrl={'order/api/order-check-list/delete?id='}
                createUrl={'order/api/order-check-list/create?order_id='+this.orderId}
                itemClass={'JSCheckListItem'}
                fields={[
                    {name:'location',label:'Location', type:"text"},
                    {name:'work_to_be_completed', type:"textarea"},
                    {name:'production',type:"checkbox"},
                    {name:'installed',type:"checkbox"},
                    {name:'clPictures',label:'Pictures', type:"image"} ,
                    {name:'clSketches',label:'Sketches', type:"image"}
                ]}
                pictures={'clPictures'}
                sketches={'clSketches'}
                model={'CmOrderCheckList'}
            />
        )
    }




}


// Exports
export default CheckList;
