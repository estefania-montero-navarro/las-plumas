import { DbConnection } from "./dbConnection";

export class PaymentService {
  public async createReceipt(
    uuid: string,
    receiptAmount: number,
    reservationId: number
  ): Promise<number> {
    const receiptId = await this.getNewReceiptId();
    if (receiptId != undefined) {
      const addSuccess = await this.addReceipt(
        uuid,
        receiptAmount,
        receiptId,
        reservationId
      );
      return addSuccess;
    }
    return 0;
  }

  public async addReceipt(
    uuid: string,
    receiptAmount: number,
    receiptId: number,
    reservationId: number
  ): Promise<number> {
    try {
      const receiptDate = new Date();
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .input("receiptId", receiptId)
        .input("receiptDate", receiptDate)
        .input("receiptAmount", receiptAmount)
        .input("reservationId", reservationId)
        .input("uuid", uuid)
        .query(
          "INSERT INTO Recipt (id, recipt_date, total_pay, reservation_id, uuid,pay_method_id) VALUES (@receiptId, @receiptDate, @receiptAmount, @reservationId, @uuid, 1);"
        );
      return 1;
    } catch (error) {
      console.error("Crear el recibo:", error);
      return 0; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }

  public async getNewReceiptId(): Promise<number | undefined> {
    try {
      const pool = await DbConnection.getInstance().getConnection();
      const result = await pool
        ?.request()
        .query("SELECT MAX(id) AS max_id FROM Recipt;");

      if (!result || !result.recordset || !result.recordset[0].max_id) {
        // Si no hay registros en la tabla o no hay ID máximo, devuelve 1 como nuevo ID
        return 1;
      }

      const maxId = result.recordset[0].max_id;
      // Incrementa el ID máximo en 1 para obtener el nuevo ID
      const newId = maxId + 1;
      return newId;
    } catch (error) {
      console.error("Error al obtener el nuevo ID de recibo:", error);
      return undefined; // Manejo de errores: devuelve undefined en caso de error
    } finally {
      // Cierra la conexión aquí, independientemente de si hay un error o no
      await DbConnection.getInstance().closeConnection();
    }
  }
}
