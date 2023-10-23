export interface Product {
  active: boolean;
  craeteBy: string;
  createAt: string;
  id: string;
  pathPicture: {
    url: string;
  }[];
  productsOption: {
    id: string;
    optionName: string;
    optionsAmount: number;
  }[];
  productAmount: number;
  productCode: string;
  productDetail: string;
  productName: string;
  productPrice: number;
  updateAt: string;
  updateBy: string;
  category: { id: string; categoryCode: string; categoryName: string };
  market_id: { id: string; marketCode: string; marketName: string };
}
