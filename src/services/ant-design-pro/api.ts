// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/profile', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function cancelOrder(body: API.CancelOrderParams, options?: { [key: string]: any }) {
  return request('/api/cancelOrder/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function makeOrder(body: API.MakeOrderParams, options?: { [key: string]: any }) {
  return request('/api/makeOrder/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取进行中订单列表  */
export async function getPendingOrderHist(
  body: API.UseridParams,
  params: {
    // query
    /** 页面的容量 */
    // pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/pendingOrderList/', {
    method: 'POST',
    params: {
      // ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取已完成交易列表  */
export async function getAllFinishedTradeHist(
  body: API.UseridParams,
  params: {
    // query
    /** 页面的容量 */
    // pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/allFinishedTradeList/', {
    method: 'POST',
    params: {
      // ...params,
    },
    data: body,
    ...(options || {}),
  });
}
/** 获取已完成交易列表  */
export async function getFinishedTradeHist(
  body: API.UseridParams,
  params: {
    // query
    /** 页面的容量 */
    // pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/finishedTradeList/', {
    method: 'POST',
    params: {
      // ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取企业历史订单列表 GET /api/stockerOrderHist */
export async function getStockerOrderHist(
  body: API.UseridParams,
  params: {
    // query
    /** 页面的容量 */
    // pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  console.log(body)
  return request('/api/stockerOrderHist/', {
    method: 'POST',
    params: {
      // ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取  */
export async function getProductList(
  body: API.UseridParams,
  params: {
    // query
    /** 页面的容量 */
    // pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/productList/', {
    method: 'POST',
    params: {
      // ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取  */
export async function getProductInfo(
  body: API.ProductParams,
  params: {
    // query
    /** 页面的容量 */
    // pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/getProductInfo/', {
    method: 'POST',
    params: {
      // ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取  */
export async function getPriceTrend(
  body: API.ProductParams,
  params: {
    // query
    /** 页面的容量 */
    // pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/getPriceTrend/', {
    method: 'POST',
    params: {
      // ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取  */
export async function getMarketDepth(
  body: API.ProductParams,
  params: {
    // query
    /** 页面的容量 */
    // pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request('/api/getMarketDepthByName/', {
    method: 'POST',
    params: {
      // ...params,
    },
    data: body,
    ...(options || {}),
  });
}


/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}
