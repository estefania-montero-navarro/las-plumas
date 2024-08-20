export interface ReservationDB {
  id: number;
  reservation_status: string;
  uuid: string;
  check_in: Date;
  check_out: Date;
}
