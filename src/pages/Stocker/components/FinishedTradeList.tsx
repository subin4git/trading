
import {ActionType,ProTable,ProColumns} from '@ant-design/pro-components';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useRef, useState } from 'react';

import { request } from '@umijs/max';
import { getStockerOrderHist, cancelOrder, getPendingOrderHist, getFinishedTradeHist } from '@/services/ant-design-pro/api';
import { Alert, message, Tabs } from 'antd';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { getProductInfo, getProductList, makeOrder } from '@/services/ant-design-pro/api';
import { Badge,TableColumnsType, TableProps  } from 'antd';

import React from 'react';
import PubSub from 'pubsub-js'

import { ColumnFilterItem } from 'antd/es/table/interface';

type pInfo = {
  name?:string;
  qty?:string;
  price?:string;
};
const FinishedTradeList = ()=> {
  const actionRef = useRef<ActionType>();
  const [searchId, setSearchId] = useState<Array<string>>([]);


  const [productInfos, setProductInfos] = useState<Array<pInfo>>([]);
  const [productNames, setProductNames] = useState<Array<string>>([]);

  const asyncFetchUnit = async (productName:string|undefined) => {
    const values ={name:(productName as string)} as API.ProductParams
    
        const msg = await getProductInfo(values, {});
        console.log("getProductInfo",productName, msg)
        productInfos.push({
          name: productName,
          qty:msg.data.qtyUnit ,
          price:msg.data.priceUnit
        } as pInfo)
        setProductInfos(productInfos)
        productNames.push(productName as string)
        setProductNames(productNames)
        console.log(productInfos)
  };
    const asyncFetchProducts = async () => {
      setProductInfos([])
      setProductNames([])
      var _id = window.localStorage.getItem("userid")
      if(!_id) {

      }
      const values ={userid: parseInt(_id as string)} as API.UseridParams

            const msg = await getProductList(values, {});
            msg.data.forEach((item:API.ProductListItem)=>asyncFetchUnit(item.productName))
    }

    const callback = () => {
      actionRef.current?.reload()
    }
    const callback_id = (name:any, data:number) => {
      setSearchId([data.toString()]);
    }
  
    // 类似于类组件中的 componentDidMount
    React.useEffect(() => {
      asyncFetchProducts()
		PubSub.subscribe("reloadHistTable", callback);
		PubSub.subscribe("histSelectId", callback_id);

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
      title: '订单号',
      dataIndex: '_id',
      key: '_id',
      // key: 'orderState',
      render: (text, record, _, action) => [
        <p style={{display:"inline"}}>
        {"订单"+record._id}
      </p>
      ],
      filteredValue: searchId,
      onFilter: (value, record) => record._id?.toString()===(value),
    },
    {
      title: '买/卖',
      dataIndex: '_id',
      key: '_id',
      // key: 'orderState',
      render: (text, record, _, action) => [
        <Tag bordered={false} color={(username==record.buyerName?"geekblue":"purple")}>
      {(username==record.buyerName?"买入":"卖出")}
    </Tag>
      ],
      filters: [
        {
          text: '买入',
          value: 'buy',
        },
        {
          text: '卖出',
          value: 'sell',
        },
      ],
      onFilter: (value, record) => record.orderDst?.indexOf(value as string) === 0,
 
    },
    {
      title: '买/卖家',
      dataIndex: 'buyerName',
      key: 'buyerName',
      // key: 'orderState',
      render: (text, record, _, action) => [
        <p style={{display:"inline"}}>
          {username==record.buyerName?(record.sellerName+"(卖家)"):(record.buyerName+"(买家)")}
        </p>
      ],
    },
    {
      title: '成交量',
      dataIndex: 'qty',
      key: 'qty',
      render: (text, record, _, action) => [
        <p style={{display:"inline"}}>
          {record.qty}{
          (productInfos.filter((item)=>item.name==(record.productName as string))[0]?.qty as string)}
        </p>
      ],
    },
    {
      title: '成交价',
      dataIndex: 'price',
      key: 'price',
      render: (text, record, _, action) => [
        <p style={{display:"inline"}}>
          {record.price}{
          (productInfos.filter((item)=>item.name==(record.productName as string))[0]?.price as string)}
        </p>
      ],
    },
    {
      title: '产品名',
      dataIndex: 'productName',
      key: 'productName',
      filters: productNames.map((item: string)=>({
        text: item,
        value: item
      } as ColumnFilterItem)),
      onFilter: (value, record) => record.productName?.indexOf(value as string) === 0,
 
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
        msg.data.forEach((record: any, i: any) => {
          record._id = username==record.buyerName?record.buyOrderId:record.sellOrderId
        });
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
      toolbar={{
        search: {
          onSearch: (value) => {
            if(value==''){
              setSearchId([])
            }else{
            setSearchId([value])
            }
          },
        },
      }}
      
    />
  );
}




export default FinishedTradeList;