import {GiftRecord} from "../records/gift.record";
import {pool} from "../utils/db";

let gift: GiftRecord;

beforeAll(() => {
    gift = new GiftRecord({
        name: "Test",
        count: 123,
    })
})

afterAll(async ()=> {
    await pool.end();
})

// test("Gift Record throws errors on calling new instance of", async () => {
//    await expect(await new GiftRecord({name: "a", count: 1})).toThrow("Gift name must be between 3 and 55 characters long");
//    await expect(await new GiftRecord({name: "Rębak", count: 0})).toThrow("The quantity of the gift should be between 1 and 999,999");
// });

test("New gift record contain name and count, but NO id", async () => {
    expect(gift.name).toBeDefined();
    expect(gift.count).toBeDefined();
    expect(gift.id).toBeUndefined();
});
test("Inserted gift record has id", async () => {
    await gift.insert();
    expect(gift.id).toBeDefined();
});
test("Gift Record id is valid uuid", async () => {
    expect(gift.id).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi);
});
test("Fn findGivenGiftCount() returns proper gift count",async () => {
    const gift = await GiftRecord.findOne("18d3a868-ad59-4e81-9a82-8a92db8287ee");
    const count = await gift.findGivenGiftCount();
    expect(count).toBe(2);
});
test("Finds one gift record", async () => {
    const found = await GiftRecord.findOne(gift.id);
    expect(found.id).toBe(gift.id);
})
test("Removes gift record", async () => {
    const removed = await gift.remove();
    expect(removed).toBe(gift.id);
})
test("List all gift records in array", async () => {
    const listAll = await GiftRecord.listAll();
    expect(listAll).toBeDefined();
})
