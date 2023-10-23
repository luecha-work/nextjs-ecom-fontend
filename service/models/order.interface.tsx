import { Product } from "./product.interface";

export interface OrderType {
  active?: boolean;
  address?: string;
  cashOnDalivery?: boolean;
  createAt?: string;
  createBy?: string;
  id?: string;
  totalAmount?: number;
  orderCode?: string;
  orderName?: string;
  orderStatusId?: string;
  orderStatus?: { id?: string; orderStatusCode?: string; orderStatusName?: string };
  parcelStatusId?: string;
  parcelStatus?: {
    id?: string;
    parcelStatusCode?: string;
    parcelStatusName?: string;
  };
  paymentTypeId?: string;
  paymentType?: { id?: string; paymentCode?: string; paymentName?: string };
  productsId?: string;
  products?: Product;
  ordersAmount?: number;
  phoneNumber?: string;
  recipient?: string;
  slipPath?: string;
  transferDate?: string;
  updateAt?: string;
  updateBy?: string;
}
