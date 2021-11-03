import React from 'react';
import ItemsListTable from '../../components/ItemsListTable';

class JobSiteRequests extends React.Component {


    constructor(props) {
        super(props);
        this.orderId = this.props.navigation.state.params.id;
    }



    render() {
        return (
                <ItemsListTable
                    navigation={this.props.navigation}
                    orderId={this.orderId}
                    url={'order/api/job-site-request?filter[order_id]='+this.orderId+'&expand=jsPictures,jsSketches'}
                    itemClass={'JSCheckListItem'}
                    fields={[
                        {name:'location',label:'Location', type:"text"},
                        {name:'what_needed',label:'What needed', type:"textarea"},
                        {name:'date_requested',type:"date"},
                        {name:'production',label:'Production', type:"checkbox"},
                        {name:'installed',label:'Installed',type:"checkbox"},
                        {name:'jsPictures',label:'Pictures', type:"image"} ,
                        {name:'jsSketches',label:'Sketches', type:"image"}
                        ]}
                    updateUrl={'order/api/job-site-request/update?id='}
                    deleteUrl={'order/api/job-site-request/delete?id='}
                    createUrl={'order/api/job-site-request/create?order_id='+this.orderId}
                    pictures={'jsPictures'}
                    sketches={'jsSketches'}
                />
        )
    }




}


// Exports
export default JobSiteRequests;
