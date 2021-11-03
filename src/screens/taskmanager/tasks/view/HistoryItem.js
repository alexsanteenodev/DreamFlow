import React from 'react';
import { ListItem} from 'react-native-elements';
import {MyText} from '../../../../components/views/Base';

const HistoryItem=({item})=>{


    return <ListItem bottomDivider>
                <ListItem.Content >
                    <ListItem.Title style={{  fontWeight:"bold" }}>Type: {item?.editor_type.substr(5,10)}</ListItem.Title>
                    <ListItem.Subtitle style={{  color: '#ffa655' }}>Editor: {item?.editor?.firstname} {item?.editor?.lastname}</ListItem.Subtitle>
                    <ListItem.Subtitle style={{  color: '#6d88ef' }}>Created: {item?.created_at}</ListItem.Subtitle>
                    {item.difference &&
                    item.difference.description.map(item=>{

                        return Object.keys(item).map(itemKey=>{
                            return  <ListItem.Subtitle key={itemKey} style={{  color: '#000' }}>
                                    <MyText style={{}}>{itemKey}</MyText>
                                    {Object.keys(item[itemKey]).map(subItemKey=>{
                                        return <React.Fragment key={subItemKey}>
                                                    <MyText style={{
                                                        textDecorationLine: 'line-through',
                                                        textDecorationStyle: 'solid',
                                                        color: '#ef3d3b'
                                                    }}>{subItemKey}</MyText>
                                                    <MyText> - </MyText>
                                                    <MyText style={{
                                                        color: '#45ef33'
                                                    }}>{item[itemKey][subItemKey]}</MyText>
                                                </React.Fragment>
                                    })}
                                </ListItem.Subtitle>
                        })
                    })
                    }
                </ListItem.Content>
            </ListItem>
};
export default HistoryItem;
