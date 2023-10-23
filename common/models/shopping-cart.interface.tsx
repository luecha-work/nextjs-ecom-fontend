export interface ShoppingCartResult {
  id: string;
  amount: number;
  cfProduct: boolean;
  product: {
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
    pathPicture: ProductPathPicture[];
    keyword: string;
    craeteBy: string;
    updateBy: string;
    productionDate: Date | null;
    expirationDate: Date | null;
    outStockNotification: string;
    notifyExpirationDate: Date | null;
    createAt: Date;
    updateAt: Date;
  };
  productsOption: {
    id: string;
    optionCode: string;
    optionName: string;
    optionsAmount: number;
    craeteBy: string;
    updateBy: string;
    createAt: Date;
    updateAt: Date;
  };
}

interface ProductPathPicture {
  url: string;
}
