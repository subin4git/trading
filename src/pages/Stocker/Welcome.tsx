import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Card, theme } from 'antd';
import React from 'react';
import { Button, Flex, Typography } from 'antd';
import OrderForm from './components/OrderForm';
import PriceLineChart from './components/PriceLineChart';
import MarketDepth from './components/MarketDepth';
import PubSub from 'pubsub-js'

import  { useState, useEffect } from 'react';

/**
 * 每个单独的卡片，为了复用样式抽成了组件
 * @param param0
 * @returns
 */
const InfoCard: React.FC<{
  title: string;
  index: number;
  desc: string;
  href: string;
}> = ({ title, href, index, desc }) => {
  const { useToken } = theme;

  const { token } = useToken();

  

  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadow,
        borderRadius: '8px',
        fontSize: '14px',
        color: token.colorTextSecondary,
        lineHeight: '22px',
        padding: '16px 19px',
        minWidth: '220px',
        flex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            lineHeight: '22px',
            backgroundSize: '100%',
            textAlign: 'center',
            padding: '8px 16px 16px 12px',
            color: '#FFF',
            fontWeight: 'bold',
            backgroundImage:
              "url('https://gw.alipayobjects.com/zos/bmw-prod/daaf8d50-8e6d-4251-905d-676a24ddfa12.svg')",
          }}
        >
          {index}
        </div>
        <div
          style={{
            fontSize: '16px',
            color: token.colorText,
            paddingBottom: 8,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontSize: '14px',
          color: token.colorTextSecondary,
          textAlign: 'justify',
          lineHeight: '22px',
          marginBottom: 8,
        }}
      >
        {desc}
      </div>
      <a href={href} target="_blank" rel="noreferrer">
        了解更多 {'>'}
      </a>
    </div>
  );
};

const Welcome: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  const [autoReload, setAutoReload] = useState(1);
  const doSomething = ()=> {
    // console.log("timeout")
    PubSub.publish("reloadData")
    if(autoReload==1) setTimeout(doSomething, 1000);
  }

    // 类似于类组件中的 componentDidMount
	React.useEffect(() => {
		setTimeout(doSomething, 1000);
	}, []);

	// 类似于类组价中 componentWillUnmout
	React.useEffect(() => {
		// 组件卸载移除监听
		return () => { 
			setAutoReload(0)
		}
	});
  return (
    <PageContainer ghost
    header={{
      title: '',
      breadcrumb: {},
    }}>
      <Flex justify="center" align='stretch' gap={8}  >
        <Flex vertical align="stretch" justify="space-between" gap={8} flex={7} style={{ padding: 2 }}>
        
        <Card
        style={{
          flex: 1,
          borderRadius: 2,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <OrderForm/>
        </Card>
            <Card
        style={{
          flex:1,
          borderRadius: 2,
        }}
        
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
        title="价格趋势"
      >
       
        <PriceLineChart/> 
        </Card>
        </Flex>
        <Card 
        title="市场深度"
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
        // 一克 一盎司
        // broker:订单分析&用户分析(抽佣)
      >
        <MarketDepth/>
        </Card>
      </Flex>
      
    </PageContainer>
  );
};

export default Welcome;
