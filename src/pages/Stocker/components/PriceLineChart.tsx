import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import PubSub from 'pubsub-js'
import { getPriceTrend } from '@/services/ant-design-pro/api';
import { List } from 'lodash';

const PriceLineChart = () => {
  const [data, setData] = useState([]);

  const [unit, setUnit] = useState<object>();


  const asyncFetch = async () => {
    const productName = window.localStorage.getItem("productName");
        if(!productName) {
    
        }
        const values ={
          name:(productName as string),
          beginTime:"2000-01-01 00:00:00",
          endTime:"3000-01-01 00:00:00",
        } as API.ProductParams
    
        const msg = await getPriceTrend(values, {});
        console.log("getPriceTrend",msg)
        setData(msg.data)

        setUnit({
          qty:window.localStorage.getItem("productQrtUnit"),
          price:window.localStorage.getItem("productPriceUnit")
        })
  };

  const productChangedCallback = () => {
		asyncFetch()
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
    const config = {
        data,
        xField: (d:API.PriceTrendItem) => new Date(d.time as string),
        yField: 'price',
        axis: { x: { title: "时间", size: 40 }, y: { title: ("成交价"+(unit?unit.price:"")), size: 36 } },
        slider: {
          x: { labelFormatter: (v) => '',},
          y: { labelFormatter: (v) => '' },
        },
        line: {
          style: {
            strokeWidth: 2,
          },
        },
        forceFit: true,
        height: 360,
        margin:10
      };
      return <Line {...config} />;
};




export default PriceLineChart;
