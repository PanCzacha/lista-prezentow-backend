import {pool, uuid} from "../utils/db";
import {ValidationError} from "../utils/error";
import {ChildEntity} from "../types/";
import {FieldPacket} from "mysql2";

type ChildRecordResults = [ChildRecord[], FieldPacket[]];

export class ChildRecord implements ChildEntity {
  public id?: string;
  public name: string;
  public giftId?: string;

  constructor(obj: ChildEntity) {
    if(!obj.name || obj.name.length < 3 || obj.name.length > 25) {
      throw new ValidationError("Name must be between 3 and 25 characters long");
    }
    this.id = obj.id;
    this.name = obj.name;
    this.giftId = obj.giftId;
  }

  async insert(): Promise<ChildEntity["id"]> {
    if(!this.id) {
      this.id = uuid();
    }
    await pool.execute("INSERT INTO `children` (`id`, `name`) VALUES(:id, :name)", {
      id: this.id,
      name: this.name,
    })
    return this.id;
  }

  async update(): Promise<void> {
    await pool.execute("UPDATE `children` SET `name` = :name, `giftId` = :giftId WHERE `id` = :id", {
      id: this.id,
      name: this.name,
      giftId: this.giftId,
    })
  }
  static async findOne(id: string): Promise<null | ChildRecord> {
    const [result] = await pool.execute("SELECT * FROM `children` WHERE `id` = :id", {
      id,
    }) as ChildRecordResults;
    return result.length === 0 ? null : new ChildRecord(result[0]);
  }

  static async listAll(): Promise<ChildRecord[]> {
    const [results] = await pool.execute("SELECT * FROM `children` ORDER BY `name` ASC") as ChildRecordResults;
    return results.map(obj => new ChildRecord(obj));
  }

}
