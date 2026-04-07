export type Reward = {
  id: number;
  customer?: {
    user?: {
      name?: string;
    };
  };
  vehicle?: {
    vehicle_number?: string;
  };
};

export type Shift = {
  id: number;
  start_time: string;
  end_time?: string | null;
  status: string;
  rewards?: Reward[];
};