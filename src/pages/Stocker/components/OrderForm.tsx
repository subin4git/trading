import {
    ProForm,
    ProFormDependency,
    ProFormSelect,
    ProFormText,
    ProCard,
    ProFormRadio,
    ProFormMoney,
    ProFormDigit,
  } from '@ant-design/pro-components';
  import { Card, theme } from 'antd';
  import { useState } from 'react';
  import { useRef } from 'react';
import { request } from '@umijs/max';
import { makeOrder } from '@/services/ant-design-pro/api';
import { Alert, message, Tabs } from 'antd';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';

import React from 'react';
import PubSub from 'pubsub-js'

  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };
  
 const OrderForm= () => {
  const { useToken } = theme;

  const { token } = useToken();
  const [orderType, setOrderType] = useState<string>('limit');

  

    return (
      <ProForm
        onFinish={async (values) => {
          await waitTime(100);
          var _id = window.localStorage.getItem("userid")
          if(!_id) {
  
          }
          values.userid = parseInt(_id as string)

          const msg = await makeOrder(values, {});
          if(msg.msg!='ok'){
            message.error(msg.msg);
          }else{
            message.success('下单成功');
            PubSub.publish('reloadHistTable')
             
          }
          // action?.reload();
        }}
        
        initialValues={{
            orderType:"limit",
            orderDst:"buy",
            productName:"gold",
            qty:1,
            price:1
        }}
        style={{
          maxHeight: '480px',
          margin:'-20px',
          padding: '24px 32px 36px',
          backgroundColor: token.colorBgContainer,
          boxShadow: token.boxShadow,
          borderRadius: '8px',
          color: token.colorTextSecondary,
        }}
       
      >
        <strong style={{fontSize:"24px"}}>订单</strong>
        <ProForm.Group style={{marginTop: '16px'}}>
        <ProFormRadio.Group
        width="md"
        name="orderDst"
        radioType="button"
        fieldProps={{size:"middle", defaultValue:"buy", buttonStyle:"solid"}}
        label="买卖类型"
        options={[
          {
            label: '买入',
            value: 'buy',
            
          },
          {
            label: '卖出',
            value: 'sell',
          },
        ]}
        />
        <ProFormRadio.Group
        width="md"
        name="orderType"
        radioType="button"
        label="订单类型"
        fieldProps={{
          size:"middle", defaultValue:"limit", buttonStyle:"solid",
          value: orderType,
          onChange: (e) => setOrderType(e.target.value),
        }}
        options={[
          {
            label: 'limit',
            value: 'limit',
            
          },
          {
            label: 'stop',
            value: 'stop',
          },
          {
            label: 'market',
            value: 'market',
          },
        ]}
        />
        </ProForm.Group>
        <ProForm.Group>
        <ProFormSelect
                options={[
                  {
                    value: 'gold',
                    label: 'gold',
                  },
                  {
                    value: 'oil',
                    label: 'oil',
                  },
                ]}
                width="sm"
                name="productName"
                label="商品"
              />
        
        <ProFormDigit
            label="数量"
            name="qty"
            width="xs"
            min={1}
            max={100}
          />
          <ProFormDigit label="单价" name="price"  width="xs" hidden={orderType=='market'}/>
        </ProForm.Group>
        
      </ProForm>
    );
  };

  export default OrderForm;