import {NextFunction, Request, Response, Router} from "express";
import { ChildRecord } from"../records/child.record";
import { GiftRecord } from "../records/gift.record";
import { ValidationError } from "../utils/error";
import {CreateChildReq, ListChildrenRes, SetGiftForChild} from "../types";


export const childRouter: Router = Router();

childRouter
  .get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const childrenList = await ChildRecord.listAll();
      const giftsList = await GiftRecord.listAll();
      res.json({
        childrenList,
        giftsList,
      } as ListChildrenRes);
    } catch (err) {
      next(err);
    }
  })
  .post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {name} = req.body as CreateChildReq;
      const newChild = new ChildRecord({name,});
      await newChild.insert();
      res.json(newChild);
    } catch (err) {
      next(err)
    }
  })
  .patch("/gift/:childId", async(req: Request, res: Response, next: NextFunction) => {
    try {
      const {childId} = req.params;
      const {giftId} = req.body as SetGiftForChild;
      const foundChild = await ChildRecord.findOne(childId);

      if (foundChild === null) {
        throw new ValidationError("Child with provided ID does not exist.")
      }

      const gift = giftId === "" ? null : await GiftRecord.findOne(giftId);

      if (gift) {
        if (gift.count <= await gift.findGiftCount()) {
          throw new ValidationError("There are no more gifts of this kind, please choose other.")
        }
      }

      foundChild.giftId = gift === null ? null : gift.id;
      await foundChild.update();
      res.json(foundChild);
    } catch (err) {
      next(err)
    }
  })
