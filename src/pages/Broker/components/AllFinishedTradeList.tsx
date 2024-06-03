
import {ProTable,ProColumns} from '@ant-design/pro-components';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { request } from '@umijs/max';
import { getStockerOrderHist, cancelOrder, getPendingOrderHist, getAllFinishedTradeHist } from '@/services/ant-design-pro/api';
import { Alert, message, Tabs } from 'antd';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';

import { useRef, useState } from 'react';
import { getProductInfo, getProductList, makeOrder } from '@/services/ant-design-pro/api';
import { Badge,TableColumnsType, TableProps  } from 'antd';

import React from 'react';
import { ColumnFilterItem } from 'antd/es/table/interface';

type pInfo = {
  name?:string;
  qty?:string;
  price?:string;
};



const AllFinishedTradeList = ()=> {
  const [searchName, setSearchName] = useState<Array<string>>([]);

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

  // 类似于类组件中的 componentDidMount
  React.useEffect(() => {
    asyncFetchProducts()
  }, []);
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
      filteredValue: searchName,
      onFilter: (value, record) => record.sellerName.includes(value),
    },
    {
      title: '买家',
      dataIndex: 'buyerName',
      key: 'buyerName',
      filteredValue: searchName,
      onFilter: (value, record) => record.buyerName.includes(value),
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
    
    search={false}
    columns={_columns}

    toolbar={{
      search: {
        onSearch: (value) => {
          if(value==''){
            setSearchName([])
          }else{
          setSearchName([value])
          }
        },
      },
    }}
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