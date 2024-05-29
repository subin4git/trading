import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';
import AllFinishedTradeList from './components/AllFinishedTradeList'
import PendingOrderList from './components/PendingOrderList';
import { Button, Flex, Typography } from 'antd';


const OrderManage: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return (
    <PageContainer ghost
    header={{
      title: '',
      breadcrumb: {},
    }}>
      <Flex justify="center" align='stretch' gap={8}  >
      <Card 
      title="进行中的订单"
        style={{
          flex:7,
          borderRadius: 2,
          padding: 2
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
      <PendingOrderList/>
        </Card>
        <Card 
        title="已完成的交易"
        style={{
          flex:6,
          borderRadius: 2,
          padding: 2
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
         <AllFinishedTradeList/>
        </Card>
        </Flex>
    </PageContainer>
  );
};

export default OrderManage;
