export interface ProductResultModel {
  id: string;
  productCode: string;
  productName: string;
  keyword: string;
  craeteBy: string;
  updateBy: string;
  createAt: Date;
  updateAt: Date;
  active: boolean;
  productDetail: string;
  productPrice: number;
  productAmount: number;
  pathPicture: imageUrl[];
  category: {
    id: string;
    categoryName: string;
    categoryCode: string;
    categoryDetail: string;
    pathPicture: string;
    createAt: Date;
    updateAt: Date;
    createBy: string;
    updateBy: string;
    active: boolean;
  };
  market: {
    id: string;
    createDate: Date;
    updateDate: Date;
    createBy: string;
    updateBy: string;
    marketName: string;
    marketCode: string;
    discription: string;
    active: boolean;
  };
}

export interface imageUrl {
  url: string;
}

export interface FormErrors {
  productName?: string;
  productDetail?: string;
  keyword?: string;
  productPrice?: string;
  productAmount?: string;
  productCost?: string;
  productCategory?: string;
}

export interface AddingProductModel {
  productName: string;
  productCode: string;
  productDetail: string;
  keyword: string;
  productPrice: number;
  productAmount: number;
  pathPicture: imageUrl[];
  active: boolean;
  productWeight: number;
  productCost: number;
  productionDate: Date | null;
  expirationDate: Date | null;
  outStockNotification: number;
  notifyExpirationDate: string | null;
}

export interface AllProductModel {
  id: string;
  productCode: string;
  productName: string;
  active: boolean;
  productDetail: string;
  productPrice: number;
  productAmount: number;
  views: number;
  productCost: number;
  productWeight: number;
  pathPicture: [
    {
      url: string;
    }
  ];
  keyword: string;
  craeteBy: string;
  updateBy: string;
  productionDate: string;
  expirationDate: string;
  outStockNotification: number;
  notifyExpirationDate: Date | null;
  createAt: Date;
  updateAt: Date;
}
