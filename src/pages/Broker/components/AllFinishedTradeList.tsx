
import {ProTable,ProColumns} from '@ant-design/pro-components';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useRef } from 'react';
import { request } from '@umijs/max';
import { getStockerOrderHist, cancelOrder, getPendingOrderHist, getAllFinishedTradeHist } from '@/services/ant-design-pro/api';
import { Alert, message, Tabs } from 'antd';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';


const _columns: ProColumns[] = [
  // {
  //   title: '时间戳',
  //   dataIndex: 'time',
  //   key: 'time',
  // },
  {
    title: '卖家',
    dataIndex: 'sellerName',
    key: 'sellerName',
  },
  {
    title: '买家',
    dataIndex: 'buyerName',
    key: 'buyerName',
  },
  {
    title: '成交量',
    dataIndex: 'qty',
    key: 'qty',
  },
  {
    title: '成交价',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: '产品名',
    dataIndex: 'productName',
    key: 'productName',
  },
];



const AllFinishedTradeList = ()=> {
  

  return (
    <ProTable<API.FinishedTradeListItem>
    
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

    const msg = await getAllFinishedTradeHist(values, params);
    console.log(typeof(msg))
    console.log(msg)
    return msg 
  }}
/>
  );
}




export default AllFinishedTradeList;