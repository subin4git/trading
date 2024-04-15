
import {ProTable,ProColumns} from '@ant-design/pro-components';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useRef } from 'react';
import { request } from '@umijs/max';
import { getStockerOrderHist, cancelOrder, getPendingOrderHist } from '@/services/ant-design-pro/api';
import { Alert, message, Tabs } from 'antd';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';


const _columns: ProColumns[] = [
    
  // {
  //   title: '时间戳',
  //   dataIndex: 'time',
  //   key: 'time',
  // },
  {
    title: '企业',
    dataIndex: 'stockerName',
    key: 'stockerName',

    onFilter: (value, record) => record.sell_order_id === value,
    sorter: (a, b) => a.sell_order_id - b.sell_order_id,
    sortDirections: ['descend'],
  },
  {
    dataIndex: 'orderDst',
    key: 'orderDst',
    render: (text, record, _, action) => [
      <p style={{display:"inline"}}>
        {record.orderDst=="buy"?"欲购":"欲售"}
      </p>
    ],
  },
  {
    title: "订单类型",
    dataIndex: 'orderType',
    key: 'orderType',
  },
  {
    title: '产品名',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: '数量',
    dataIndex: 'qty',
    key: 'qty',
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
  },
  
];



const PendingOrderList = ()=> {
  

  return (
    <ProTable<API.PendingOrderListItem>

    search={false}
    columns={_columns}
  // params 是需要自带的参数
  // 这个参数优先级更高，会覆盖查询表单的参数
  // params={params}
  request={async (params, sort, filter) => {
    var _id = window.localStorage.getItem("userid")
    if(!_id) {

    }
    const values ={userid:parseInt(_id as string)} as API.UseridParams

    const msg = await getPendingOrderHist(values, params);
    console.log(typeof(msg))
    console.log(msg)
    return msg 
  }}
/>
  );
}




export default PendingOrderList;