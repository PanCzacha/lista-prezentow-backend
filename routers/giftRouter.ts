import {NextFunction, Request, Response, Router} from "express";
import {GiftRecord} from "../records/gift.record";
import {ValidationError} from "../utils/error";
import {CreateGiftReq, GetSingleGiftRes} from "../types";

export const giftRouter: Router = Router();

giftRouter
    .get("/", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const giftsList = await GiftRecord.listAll();
            res.json({
                giftsList,
            })
        } catch (err) {
            next(err)
        }
    })
    .get("/:giftId", async (req: Request, res: Response, next: NextFunction) => {
        const {giftId} = req.params;
        try {
            const singleGift = await GiftRecord.findOne(giftId);
            const givenGiftsCount = await singleGift.findGivenGiftCount();
            res.json({
                singleGift,
                givenGiftsCount,
            } as GetSingleGiftRes)
        } catch (err) {
            next(err)
        }
    })
    .post("/", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const newGift = new GiftRecord(req.body as CreateGiftReq);
            await newGift.insert();

            res.json(newGift);

        } catch (err) {
            next(err);
        }
    })
    .delete("/:id", async (req, res, next) => {
        try {
            const gift = await GiftRecord.findOne(req.params.id);
            if (!gift) {
                throw new ValidationError("No such gift");
            }

            if (await gift.findGivenGiftCount() > 0) {
                throw new ValidationError("Cannot remove given gift");
            }
            await gift.remove();
            res.end();
        } catch (err) {
            next(err)
        }
    })

