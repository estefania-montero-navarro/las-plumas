export interface RoomDB {
  id: number;
  type: string;
  maxGuests: number;
  noBeds: number;
  price: number;
  amount: number;
  isAvailable: boolean;
}