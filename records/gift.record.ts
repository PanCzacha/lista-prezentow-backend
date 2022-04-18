import {pool, uuid} from "../utils/db";
import {ValidationError} from "../utils/error";
import {GiftEntity} from "../types";
import {FieldPacket} from "mysql2";

type GiftRecordResults = [GiftRecord[], FieldPacket[]];

export class GiftRecord implements GiftEntity{
  id?: string;
  name: string;
  count: number;

  constructor(obj: GiftEntity) {
    if(!obj.name || obj.name.length < 3 || obj.name.length > 55) {
      throw new ValidationError("Gift name must be between 3 and 55 characters long");
    }
    if(!obj.count || obj.count < 1 || obj.count > 999999) {
      throw new ValidationError("The quantity of the gift should be between 1 and 999,999");
    }

    this.id = obj.id;
    this.name = obj.name;
    this.count = obj.count;
  }

  async insert(): Promise<string> {
    if(!this.id) {
      this.id = uuid();
    }
    await pool.execute("INSERT INTO `gifts` VALUES(:id, :name, :count)", {
      id: this.id,
      name: this.name,
      count: this.count,
    })

    return this.id;
  }

  async findGiftCount(): Promise<GiftEntity["count"]> {
    const [[{count}]] = await pool.execute("SELECT COUNT(*) AS `count` FROM `children` WHERE `giftId` = :id",
      {
        id: this.id,
      }) as GiftRecordResults
    return count
  }

  async remove(): Promise<void> {
    await pool.execute("DELETE FROM `gifts` WHERE `id` = :id", {
      id: this.id,
    })
  }

  static async findOne(id: string): Promise<null | GiftRecord> {
    const [result] = await pool.execute("SELECT * FROM `gifts` WHERE `id` = :id", {
      id,
    }) as GiftRecordResults;
    return result.length === 0 ? null : new GiftRecord(result[0]);
  }

  static async listAll(): Promise<GiftRecord[]> {
   const [results] = await pool.execute("SELECT * FROM `gifts` ORDER BY `name` ASC") as GiftRecordResults;
    return results.map(obj => new GiftRecord(obj));
  }

}
