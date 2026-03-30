export interface Vehicle {
  id: number;
  number: string;
  type: number;
}

export interface Customer {
  customer_id: number;
  mobile: string;
  name: string;
  email: string;
  address: string;
  vehicles: Vehicle[];
  alternate_mobiles: string[];
}

export type AlternateMobile = {
  id?: number;
  mobile: string;
  vehicles: Vehicle[];
  verified: boolean;
  otpSent?: boolean;
  deleteRequested?: boolean;
  error?: {
    mobile?: string;
    vehicle?: string;
  };
};