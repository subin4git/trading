import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import { request } from '@umijs/max';
import { getStockerOrderHist, cancelOrder } from '@/services/ant-design-pro/api';
import { Alert, message, Tabs } from 'antd';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';

import React from 'react';
import PubSub from 'pubsub-js'

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





const StockerOrderList= () => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const columns: ProColumns<API.StockerOrderHistItem>[] = [
    // {
    //   title: '时间戳',
    //   key: 'time',
    //   dataIndex: 'time',
    //   // valueType: 'date',
    // },
    {
      title: '',
      dataIndex: 'orderDst',
      render: (text, record, _, action) => [
        <p style={{display:"inline"}}>
          {"订单"+record.orderId+" " + (record.orderDst=="buy"?"买入":"卖出")}
        </p>
      ],
    },
    {
      title: '产品名',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      key:'orderType',
    },

    {
      title: '初始数量',
      dataIndex: 'originVol',
      key: 'originVol',
    },
    {
      title: '当前数量',
      dataIndex: 'qty',
      key: 'qty',
    },
    
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    
  
    {
      title: '状态',
      dataIndex: 'orderState',
      key: 'orderState',
      render: (text, record, _, action) => [
        <p style={{display:"inline"}}>
          {record.orderType=="cancel"?"已取消":record.orderIsDone?"已完成":"进行中"}
        </p>,
        <a onClick={async() => {
          
          console.log("cancel ",record)
          var _id = window.localStorage.getItem("userid")
          if(!_id) {
  
          }
          const values ={
            userid:parseInt(_id as string),
            orderId:record.orderId
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
    },
  ];

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
      dateFormatter="string"
      headerTitle="历史订单"
      // toolBarRender={() => [
        
      // ]}
    />
  );
};

export default StockerOrderList;