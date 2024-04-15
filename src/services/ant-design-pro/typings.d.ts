// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    username?: string;
    // avatar?: string;
    usertype?: string;
    // email?: string;
    // signature?: string;
    // title?: string;
    // group?: string;
    // tags?: { key?: string; label?: string }[];
    // notifyCount?: number;
    // unreadCount?: number;
    // country?: string;
    // access?: string;
    // geographic?: {
    //   province?: { label?: string; key?: string };
    //   city?: { label?: string; key?: string };
    // };
    // address?: string;
    // phone?: string;
  };

  type LoginResult = {
    status?: string;
    data?:{
      userid?:number;
    };
    // type?: string;
    // currentAuthority?: string;
  };

  type LoginResult = {
    status?: string;
    // type?: string;
    // currentAuthority?: string;
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    // autoLogin?: boolean;
    usertype?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type UseridParams = {
    userid?:number;
  };
  type CancelOrderParams = {
    userid?:number;
    orderId?:number;
  };
  type MakeOrderParams = {
    userid?:number;
    orderType?:string;
    orderDst?:string;
    productName?:string;
    qty?:number;
    price?:number;
  };

  type FinishedTradeListItem = {
    buyerName?: string;
    sellerName?: string;
    qty: number;
    price: number;
    productName?:string;
  };
  type PendingOrderListItem = {
    stockerName?: string;
    orderId?:number;
    orderDst?: string;
    orderType?: string;
    qty: number;
    price: number;
    productName?:string;
  };

  type StockerOrderHistItem = {
    orderId?:number;
    orderDst?: string;
    orderType?: string;
    orderIsDone?:number;
    qty: number;
    price: number;
    productName?:string;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };
}
