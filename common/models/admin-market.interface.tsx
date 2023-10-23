export interface UsersInMarketModel {
  id: string;
  marketName: string;
  marketCode: string;
  discription: string;
  createAt: Date;
  updateAt: Date;
  createBy: string;
  updateBy: string;
  active: boolean;
  adminMarkets: AdminMarket[];
}

interface AdminMarket {
  id: string;
  users: {
    id: string;
    firstname: string;
    lastname: string;
    phoneNumber: string;
    email: string;
    active: boolean;
    createBy: string;
    updateBy: string;
    createAt: Date;
    updateAt: Date;
    dateOfBirth: Date;
    gender: string;
    role: {
      id: string;
      roleCode: number;
      roleName: string;
      active: boolean;
      createBy: string;
      updateBy: string | null;
      createAt: Date;
      updateAt: Date;
    };
  };
}
