
import {ActionType,ProTable,ProColumns} from '@ant-design/pro-components';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useRef } from 'react';
import { request } from '@umijs/max';
import { getStockerOrderHist, cancelOrder, getPendingOrderHist, getFinishedTradeHist } from '@/services/ant-design-pro/api';
import { Alert, message, Tabs } from 'antd';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';


import React from 'react';
import PubSub from 'pubsub-js'



const FinishedTradeList = ()=> {
  const actionRef = useRef<ActionType>();

  const callback = () => {
		actionRef.current?.reload()
	}

	// 类似于类组件中的 componentDidMount
	React.useEffect(() => {
		PubSub.subscribe("reloadHistTable", callback);
	}, []);

	// 类似于类组价中 componentWillUnmout
	React.useEffect(() => {
		// 组件卸载移除监听
		return () => {
			PubSub.unsubscribe()
		}
	});

  const username = window.localStorage.getItem("username");
  const columns: ProColumns[] = [
    // {
    //   title: '时间戳',
    //   dataIndex: 'time',
    //   key: 'time',
    // },
   
    {
      title: '',
      dataIndex: 'buyerId',
      key: 'buyerId',
      // key: 'orderState',
      render: (text, record, _, action) => [
        <p style={{display:"inline"}}>
          {username==record.buyerName?("订单"+record.buyerId+" 买入"):(record.sellerId+" 卖出")}
        </p>
      ],
    },
    {
      title: '买/卖家',
      dataIndex: 'buyerName',
      key: 'buyerName',
      // key: 'orderState',
      render: (text, record, _, action) => [
        <p style={{display:"inline"}}>
          {username==record.buyerName?record.sellerName:record.buyerName}
        </p>
      ],
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
  return (
    <ProTable<API.FinishedTradeListItem>
      columns={columns}
      actionRef={actionRef}
      // cardBordered
      request={async (params, sort, filter) => {
        var _id = window.localStorage.getItem("userid")
        if(!_id) {
    
        }
        const values ={userid: parseInt(_id as string)} as API.UseridParams
    
        const msg = await getFinishedTradeHist(values, params);
        console.log(typeof(msg))
        console.log(msg)
        return msg
      }}
      // editable={{
      //   type: 'multiple',
      // }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      // rowKey="id"
      // search={{
      //   labelWidth: 'auto',
      // }}
      search={false}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      // form=
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
    />
  );
}




export default FinishedTradeList;