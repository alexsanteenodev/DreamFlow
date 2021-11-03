import React from 'react';
import ItemsListTable from '../../components/ItemsListTable';

class ExteriorColors extends React.Component {


    constructor(props) {
        super(props);
        this.orderId = this.props.navigation.state.params.id;
    }
    static navigationOptions = {
        title: 'Exterior colors',
    };


    render() {
        return (
            <ItemsListTable
                navigation={this.props.navigation}
                orderId={this.orderId}
                url={'order/api/order-exterior-colors?filter[order_id]='+this.orderId}
                updateUrl={'order/api/order-exterior-colors/update?id='}
                deleteUrl={'order/api/order-exterior-colors/delete?id='}
                createUrl={'order/api/order-exterior-colors/create?order_id='+this.orderId}
                itemClass={'JSCheckListItem'}
                fields={[
                    {name:'note',type:"text"},
                ]}
                model={'CmOrderExteriorColors'}
            />
        )
    }




}


// Exports
export default ExteriorColors;
