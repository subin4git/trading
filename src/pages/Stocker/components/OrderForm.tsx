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
  import { ReloadOutlined } from '@ant-design/icons';

  import { useState } from 'react';
  import { useRef } from 'react';
import { request } from '@umijs/max';
import { getProductInfo, getProductList, makeOrder } from '@/services/ant-design-pro/api';
import { Alert, message, Tabs } from 'antd';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Button, Flex} from 'antd';
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

  const [unit, setUnit] = useState<object>();
  const asyncFetchUnit = async () => {
    const _ = window.localStorage.getItem("productName");
    const productName = _?_:"gold"
    const values ={name:(productName as string)} as API.ProductParams
    
        const msg = await getProductInfo(values, {});
        console.log("getProductInfo",msg)
        setUnit({
          qty:msg.data.qtyUnit ,
          price:msg.data.priceUnit
        })
        window.localStorage.setItem("productQrtUnit", msg.data.qtyUnit as string);
        window.localStorage.setItem("productPriceUnit", msg.data.priceUnit as string);
  };

	// 类似于类组件中的 componentDidMount
	React.useEffect(() => {
    asyncFetchUnit()
	}, []);


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
        <Flex align="center">
        <span style={{fontSize:"medium", fontWeight:"bold"}} >请选择订单商品</span>
        <Button icon={<ReloadOutlined />} type="text" style={{marginLeft:"20px"}}
        onClick={
          PubSub.publish("productChanged")
        } >
            刷新商品信息
          </Button>
              </Flex>
        <ProFormSelect
                request={async () => {
                  var _id = window.localStorage.getItem("userid")
        if(!_id) {
    
        }
        const values ={userid: parseInt(_id as string)} as API.UseridParams
    
                  const msg = await getProductList(values, {});
        console.log("getProductList",msg)

            
                 const list = msg.data.map((item:API.ProductListItem) => ({
                    label: item.productName,
                    value: item.productName,
                  }));
                  console.log("getProductList list",list)
                  return list
                }}
                width="sm"
                name="productName"
                style={{marginTop: '16px'}}
                fieldProps={{ onSelect: async (e) => {
                  window.localStorage.setItem("productName", e as string);
                  await asyncFetchUnit()
                  PubSub.publish("productChanged", e as string)
                }}}
              />
              
        <ProForm.Group style={{marginTop: '0px'}}>
        
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
        
        
        <ProFormDigit
            label={"数量"+(unit?'/'+unit.qty:'')}
            name="qty"
            width="xs"
            min={1}
            max={1000000}
          />
          <ProFormDigit label={"单价"+(unit?'/'+unit.price:'')} name="price"  width="xs" hidden={orderType=='market'}/>
        </ProForm.Group>
        
      </ProForm>
    );
  };

  export default OrderForm;