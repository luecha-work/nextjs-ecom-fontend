export interface OrdersModel {
  id: string;
  createBy: string;
  updateBy: string;
  createAt: Date;
  updateAt: Date;
  orderCode: string;
  orderName: string;
  address: string;
  phoneNumber: string;
  active: boolean;
  recipient: string;
  totalAmount: number;
  ordersAmount: number;
  slipPath: string;
  transferDate: Date;
  cashOnDalivery: boolean;
  paymentType: {
    id: string;
    paymentName: string;
    paymentCode: string;
    createDate: Date;
    updateDate: Date;
    createBy: string;
    updateBy: string;
    active: boolean;
  };
  orderStatus: {
    id: string;
    createAt: Date;
    updateAt: Date;
    description: string;
    orderStatusCode: string;
    orderStatusName: string;
    active: boolean;
    updateBy: string;
    createBy: string;
  };
  parcelStatus: {
    id: string;
    parcelStatusName: string;
    parcelStatusCode: string;
    description: string;
    active: boolean;
    createAt: Date;
    updateAt: Date;
    createBy: string;
    updateBy: string;
  };
  products: {
    id: string;
    productCode: string;
    productName: string;
    craeteBy: string;
    updateBy: string;
    createAt: Date;
    updateAt: Date;
    active: boolean;
    productDetail: string;
    productPrice: number;
    productAmount: number;
    pathPicture: string;
  };
  parcelDelivery: {
    id: string;
    parcelNumber: string | null;
    deliveryDate: Date | null;
    receivingParcelDate: Date | null;
    transportCompany: string | null;
    description: string | null;
    createBy: string;
    updateBy: string;
    createAt: Date;
    updateAt: Date;
  };
}

export interface ParcelStatusModel {
  id: string;
  parcelStatusName: string;
  parcelStatusCode: string;
  description: string;
  active: boolean;
  createAt: Date;
  updateAt: Date;
  createBy: string;
  updateBy: string;
}

export interface OrdersStatusModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  description: string;
  orderStatusCode: string;
  orderStatusName: string;
  active: boolean;
  updateBy: string;
  createBy: string;
}

export interface OrderDetailResult {
  status_code: string;
  result: OrderDetailModel;
  JWT_Token: string;
  messes: string;
}

export interface OrderDetailModel {
  id: string;
  createBy: string;
  updateBy: string;
  createAt: Date;
  updateAt: Date;
  orderCode: string;
  orderName: string;
  address: string;
  phoneNumber: string;
  active: boolean;
  recipient: string;
  numberPieces: number;
  cashOnDalivery: boolean;
  slipPath: string;
  paymentAmount: number;
  transferDate: Date | null;
  deliveryTime: Date | null;
  parcelReceivedTime: Date | null;
  products: {
    id: string;
    productCode: string;
    productName: string;
    craeteBy: string;
    updateBy: string;
    createAt: Date;
    updateAt: Date;
    active: boolean;
    productDetail: string;
    productPrice: number;
    productAmount: number;
    pathPicture: pathProductPicture[];
  };
  paymentType: {
    id: string;
    paymentName: string;
    paymentCode: string;
    createDate: Date;
    updateDate: Date;
    createBy: string;
    updateBy: string;
    active: boolean;
  };
  parcelDelivery: {
    id: string;
    parcelNumber: string | null;
    deliveryDate: Date | null;
    receivingParcelDate: Date | null;
    transportCompany: string | null;
    description: string | null;
    createBy: string;
    updateBy: string;
    createAt: Date;
    updateAt: Date;
  };
}

export interface ParcelStatusModel {
  id: string;
  parcelStatusName: string;
  parcelStatusCode: string;
  description: string;
  active: boolean;
  createAt: Date;
  updateAt: Date;
  createBy: string;
  updateBy: string;
}

export interface OrdersStatusModel {
  id: string;
  createAt: Date;
  updateAt: Date;
  description: string;
  orderStatusCode: string;
  orderStatusName: string;
  active: boolean;
  updateBy: string;
  createBy: string;
}

export interface OrderDetailResult {
  status_code: string;
  result: OrderDetailModel;
  JWT_Token: string;
  messes: string;
}

interface pathProductPicture {
  url: string;
}

export interface OrderDetailModel {
  id: string;
  createBy: string;
  updateBy: string;
  createAt: Date;
  updateAt: Date;
  orderCode: string;
  orderName: string;
  address: string;
  phoneNumber: string;
  active: boolean;
  recipient: string;
  totalAmount: number;
  ordersAmount: number;
  slipPath: string;
  transferDate: Date | null;
  cashOnDalivery: boolean;
  products: {
    id: string;
    productCode: string;
    productName: string;
    craeteBy: string;
    updateBy: string;
    createAt: Date;
    updateAt: Date;
    active: boolean;
    productDetail: string;
    productPrice: number;
    productAmount: number;
    pathPicture: pathProductPicture[];
  };
  paymentType: {
    id: string;
    paymentName: string;
    paymentCode: string;
    createDate: Date;
    updateDate: Date;
    createBy: string;
    updateBy: string;
    active: boolean;
  };
  parcelDelivery: {
    id: string;
    parcelNumber: string | null;
    deliveryDate: Date | null;
    receivingParcelDate: Date | null;
    transportCompany: string | null;
    description: string | null;
    createBy: string;
    updateBy: string;
    createAt: Date;
    updateAt: Date;
  };
}
