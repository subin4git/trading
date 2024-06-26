
import {ActionType,ProTable,ProColumns} from '@ant-design/pro-components';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Button, Flex, Typography } from 'antd';

import { useRef } from 'react';
import { request } from '@umijs/max';
import { getStockerOrderHist, cancelOrder, getPendingOrderHist, getFinishedTradeHist, getMarketDepth } from '@/services/ant-design-pro/api';
import { Alert, message, Tabs } from 'antd';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';



import React from 'react';
import PubSub from 'pubsub-js'
import { List } from 'lodash';

import { Area } from '@ant-design/plots';
import  { useState, useEffect } from 'react';


const MarketDepth = ()=> {
  
  const [priceMin, setPriceMin] = useState<number>(500);
  const [priceSellMin, setPriceSellMin] = useState<number>(500);
  const [priceBuyMax, setPriceBuyMax] = useState<number>(500);
  const [dataBuy, setDataBuy] = useState<Array<API.BuyDepthItem>>([]);
  const [dataSell, setDataSell] = useState<Array<API.SellDepthItem>>([]);

  const actionRefBuy = useRef<ActionType>();
  const actionRefSell = useRef<ActionType>();
  const [unit, setUnit] = useState<object>();

  const asyncFetch = async () => {
    const _ = window.localStorage.getItem("productName");
    const productName = _?_:"gold"
        if(!productName) {
    
        }
        const values ={name:(productName as string)} as API.ProductParams
    
        const msg = await getMarketDepth(values, {});
        console.log("getMarketDepth",msg)

        var len = Math.max(msg.data.buyDepth.length, msg.data.sellDepth.length)
        len = len%10==0? len:((len/10+1)*10-2)
        
        setPriceBuyMax(msg.data.buyDepth[0].price)
        setPriceSellMin(msg.data.sellDepth[0].price)

        while(len > msg.data.sellDepth.length){
          msg.data.sellDepth.push({
            price:"-",
            sellVol:"-",
            level:"-"
          })
        }
        while(len > msg.data.buyDepth.length){
          msg.data.buyDepth.push({
            price:"-",
            buyVol:"-",
            level:"-"
          })
        }
        setDataBuy(msg.data.buyDepth)
        setDataSell(msg.data.sellDepth)
        setUnit({
          qty:window.localStorage.getItem("productQrtUnit"),
          price:window.localStorage.getItem("productPriceUnit")
        })
        actionRefBuy.current?.reload()
    actionRefSell.current?.reload()
  };

  const productChangedCallback = () => {
    asyncFetch();
		
	}

	// 类似于类组件中的 componentDidMount
	React.useEffect(() => {
    asyncFetch()
		PubSub.subscribe("productChanged", productChangedCallback);
    PubSub.subscribe("reloadData", productChangedCallback);
	}, []);

	// 类似于类组价中 componentWillUnmout
	React.useEffect(() => {
		// 组件卸载移除监听
		return () => {
			PubSub.unsubscribe()
		}
	});

  const bidColumns: ProColumns[] = [
    // {
    //   title: '时间戳',
    //   dataIndex: 'time',
    //   key: 'time',
    // },
   
    {
      title: '欲购数量'+(unit?unit.qty:""),
      dataIndex: 'buyVol',
      key: 'buyVol',
    },
    {
      title: '欲购价格'+(unit?unit.price:""),
      dataIndex: 'price',
      key: 'price',
    },
  ];
  const offerColumns: ProColumns[] = [
    // {
    //   title: '时间戳',
    //   dataIndex: 'time',
    //   key: 'time',
    // },
   
    
    {
      title: '欲售价格'+(unit?unit.price:""),
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '欲售数量'+(unit?unit.qty:""),
      dataIndex: 'sellVol',
      key: 'sellVol',
    },
  ];

  const configBuy = {
    data: dataBuy.filter(i=>i.level?.toString()!='-'),
    xField: (d)=>(dataBuy.filter(i=>i.level?.toString()!='-').length - d.level),
    yField: (d)=>(priceBuyMax - d.price),
    axis: { x: false, y: false},
    style: {
      fill: 'linear-gradient(-90deg, white 0%, darkgreen 100%)',
    },
    line: {
      style: {
        stroke: 'darkgreen',
        strokeWidth: 2,
      },
    },
    tooltip: { channel: 'y', valueFormatter: (d) => priceBuyMax - d},
    height: 120,
    width:180,
    margin:0
  };

  const configSell = {
    data: dataSell.filter(i=>i.level?.toString()!='-'),
    xField: 'level',
    yField: (d)=>(d.price - priceSellMin),
    axis: { x: false, y: false },
    style: {
      fill: 'linear-gradient(-90deg, white 0%, darkred 100%)',
    },
    line: {
      style: {
        stroke: 'darkred',
        strokeWidth: 2,
      },
    },
    tooltip: { channel: 'y', valueFormatter: (d) => d+priceSellMin},
    display: "none",
    height: 120,
    width:180,
    margin:0
  };

  return (
    <Flex justify="center" align='center' gap={0}  vertical>
      <Flex justify="center" align='stretch' gap={0}  >
    <Area {...configBuy} />
    <Area {...configSell} />
    </Flex>
    <Flex justify="center" align='stretch' gap={0}  >
    <ProTable<API.BuyDepthItem>
      columns={bidColumns}
      actionRef={actionRefBuy}
      // cardBordered
      dataSource={dataBuy}
      // scroll={{ y: true }}
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
      options={false}
      // form=
      pagination={{
        pageSize: 10,
        onChange: (page) => console.log(page),
        showSizeChanger: false,
        // showLessItems: true,
        showTitle: false,
        showTotal: (total, range) => ``
      }}
      dateFormatter="string"
    />
    <ProTable<API.SellDepthItem>
      style={{ clipPath: "polygon(22px 0, 100% 0, 100% 100%, 22px 100%)",
        marginLeft:"-44px"
      }}
      columns={offerColumns}
      actionRef={actionRefSell}
      // cardBordered
      dataSource={dataSell}
      // scroll={{ y: true }}

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
      options={false}
      // form=
      pagination={{
        pageSize: 10,
        onChange: (page) => console.log(page),
        showSizeChanger: false,
        // showLessItems: true,
        showTitle: false,
        showTotal: (total, range) => ``
      }}
      dateFormatter="string"
    />
    </Flex>
    </Flex>
  );
}




export default MarketDepth;