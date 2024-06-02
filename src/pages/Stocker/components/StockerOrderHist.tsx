import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import { request } from '@umijs/max';
import { getStockerOrderHist, cancelOrder } from '@/services/ant-design-pro/api';
import { getProductInfo, getProductList, makeOrder } from '@/services/ant-design-pro/api';
import { Alert, message, Tabs } from 'antd';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Badge,TableColumnsType, TableProps  } from 'antd';

import React from 'react';
import PubSub from 'pubsub-js'
import { ColumnFilterItem } from 'antd/es/table/interface';

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};



export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};



type pInfo = {
  name?:string;
  qty?:string;
  price?:string;
};
const StockerOrderList= () => {
  const [tableData, setTableData] = useState<Array<API.StockerOrderHistItem>>();
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
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
  
    // 类似于类组件中的 componentDidMount
    React.useEffect(() => {
      asyncFetchProducts()
      PubSub.subscribe("reloadHistTable", callback);
    }, []);
  
    // 类似于类组价中 componentWillUnmout
    React.useEffect(() => {
      // 组件卸载移除监听
      return () => {
        PubSub.unsubscribe()
      }
    });

  const columns: ProColumns<API.StockerOrderHistItem>[] = [
    // {
    //   title: '时间戳',
    //   key: 'time',
    //   dataIndex: 'time',
    //   // valueType: 'date',
    // },
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text, record, _, action) => [
        <p style={{display:"inline"}}>
          {"订单"+record.orderId}
        </p>
      ],
      filteredValue: searchId,
      onFilter: (value, record) => record.orderId?.toString()===(value),
    },
    {
      title: '买/卖',
      dataIndex: 'orderDst',
      render: (text, record, _, action) => [
          <Tag bordered={false} color={(record.orderDst=="buy"?"geekblue":"purple")}>
        {(record.orderDst=="buy"?"买入":"卖出")}
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
      title: '产品名',
      dataIndex: 'productName',
      key: 'productName',
      filters: productNames.map((item: string)=>({
        text: item,
        value: item
      } as ColumnFilterItem)),
      onFilter: (value, record) => record.productName?.indexOf(value as string) === 0,
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      key:'orderType',
      render: (text, record, _, action) => [
        <Tag bordered={false} color={(record.orderType=="limit"?"volcano":
        record.orderType=="stop"?"gold":
        record.orderType=="market"?"magenta":
        "red"
      )
        }>
      {record.orderType}
    </Tag>
    ],
    filters: [
      {
        text: 'limit',
        value: 'limit',
      },
      {
        text: 'stop',
        value: 'stop',
      },
      {
        text: 'cancel',
        value: 'cancel',
      },
      {
        text: 'market',
        value: 'market',
      },
    ],
    onFilter: (value, record) => record.orderType?.indexOf(value as string) === 0,
    },

    {
      title: '初始数量',
      dataIndex: 'originVol',
      key: 'originVol',
      render: (text, record, _, action) => [
        <p style={{display:"inline"}}>
          {record.originVol}{
          (productInfos.filter((item)=>item.name==(record.productName as string))[0]?.qty as string)}
        </p>
      ],
    },
    {
      title: '当前数量',
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
      title: '价格',
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
      title: '状态',
      dataIndex: 'orderState',
      key: 'orderState',
      render: (text, record, _, action) => [
        <Space>
          <Badge status={record.orderType=="cancel"?"default":record.orderIsDone?"success":"processing"} />
        <p style={{display:"inline"}}>
          {record.orderType=="cancel"?"已取消":record.orderIsDone?"已完成":"进行中"}
        </p>
        </Space>,
        <a onClick={async() => {
          
          console.log("cancel ",record)
          var _id = window.localStorage.getItem("userid")
          if(!_id) {
  
          }
          const values ={
            userid:parseInt(_id as string),
            orderId:record.orderId,
            orderDst:record.orderDst,
            productName:record.productName
          } as API.CancelOrderParams
  
          const msg = await cancelOrder(values, {});
          if(msg.msg!='ok'){
            const defaultCancleFailureMessage = intl.formatMessage({
              id:"pages.stocker.cancelFail",
              defaultMessage: msg.msg,
            });
            message.error(defaultCancleFailureMessage);
          }else{
            const defaultCancelSuccessMessage = intl.formatMessage({
              id:"pages.stocker.cancelOk",
              defaultMessage: '取消成功！',
            });
            message.success(defaultCancelSuccessMessage);
          }
          action?.reload();
          
        }}
        style={{
          visibility:record.orderIsDone?"hidden":"visible",
          display:"inline",
          marginLeft:"7px"
        }}
        target="_blank" rel="noopener noreferrer" key="view">
          取消
        </a>
      ],
      filters: [
        {
          text: '进行中',
          value: '进行中',
        },
        {
          text: '已完成',
          value: '已完成',
        },
        {
          text: '已取消',
          value: '已取消',
        },
      ],
      onFilter: (value, record) => record.orderType=="cancel"?"已取消"===value:record.orderIsDone?"已完成"===value:"进行中"===value,
    },
  ];

	

  return (
    <ProTable<API.StockerOrderHistItem>
      columns={columns}
      actionRef={actionRef}
      // cardBordered
      request={async (params, sort, filter) => {
        var _id = window.localStorage.getItem("userid")
        if(!_id) {

        }
        const values ={userid:parseInt(_id as string)} as API.UseridParams

        const msg = await getStockerOrderHist(values, params);
        console.log(typeof(msg))
        console.log(msg)
        setTableData(msg.data)
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
      // form={{
      //   // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
      //   syncToUrl: (values, type) => {
      //     if (type === 'get') {
      //       return {
      //         ...values,
      //         created_at: [values.startTime, values.endTime],
      //       };
      //     }
      //     return values;
      //   },
      // }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
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
      // onRow={(record, rowIndex) => {
      //   return {
      //     onClick: event => {PubSub.publish("histSelectId", record.orderId)}, // click row
      //   };
      // }}

      
      dateFormatter="string"
      // toolBarRender={() => [
        
      // ]}
    />
  );
};

export default StockerOrderList;