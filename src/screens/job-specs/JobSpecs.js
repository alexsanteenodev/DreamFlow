import React from 'react';
import ItemsListTable from '../../components/ItemsListTable';

class JobSpecs extends React.Component {


    constructor(props) {
        super(props);
        this.orderId = this.props.navigation.state.params.id;
    }



    render() {
        return (
            <ItemsListTable
                navigation={this.props.navigation}
                orderId={this.orderId}
                url={'order/api/order-job-specs?filter[order_id]='+this.orderId+'&expand=fieldsValues'}
                updateUrl={'order/api/order-job-specs/update?id='}
                deleteUrl={'order/api/order-job-specs/delete?id='}
                createUrl={'order/api/order-job-specs/create?order_id='+this.orderId}
                itemClass={'JSCheckListItem'}
                customFieldsUrl={'order/api/order-job-specs/fields'}
                fields={[
                    {name:'room',label:'Room', type:"text"},
                    {name:'number', type:"text"},
                    {name:'project_name',type:"text"},
                    {name:'address',type:"text"},
                    {name:'city',type:"text"},
                    {name:'province',type:"text"},
                    {name:'postal_code',type:"text"},
                    {name:'country',type:"text"},
                ]}
                model={'CmOrderJobSpecs'}
            />
        )
    }




}


// Exports
export default JobSpecs;
