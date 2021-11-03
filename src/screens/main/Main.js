import React from 'react';
import ItemsList from '../../components/itemlist/ItemsList';

// Screen: Counter
class Main extends React.Component {

    static navigationOptions = {
        title: 'Orders',
    };

    render() {
        return (
            <ItemsList
                navigation={this.props.navigation}
                url={'order/api/order/workflow?expand=workflow'}
                itemClass={'OrderItem'}
                fields={['name','order_number']}
                search={'filter[cm_order.name]'}
                filters={[
                    {
                        name:'cm_order.order_number',
                        values:[
                            {
                                label:'C2S',
                                value:'C2S%'
                            },
                            {
                                label:'DS',
                                value:'DS%'
                            },
                            {
                                label:'C2S & DS',
                                value:'',
                                selected:true
                            },
                        ]
                    },
                    {
                        name:'cm_order_status.workflow',
                        values:[
                            {
                                label:'Workflow orders',
                                value:1,
                                selected:true
                            },
                            {
                                label:'All orders',
                                value:''
                            },
                        ]
                    },
                    {
                        name:'cm_order.type',
                        values:[
                            {
                                label:'Orders',
                                value:'order',
                                selected:true
                            },
                            {
                                label:'Orders&Leads',
                                value:''
                            },
                        ]
                    },
                ]}
            />
        )
    }
}

// Exports
export default Main;
