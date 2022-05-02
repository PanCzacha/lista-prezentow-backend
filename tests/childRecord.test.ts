import {ChildRecord} from "../records/child.record";
import {pool} from "../utils/db";

afterAll(async () => {
    await pool.end();
});

test("Returns array of objects from db", async () => {
    const children = await ChildRecord.listAll();
    expect(children).toBeDefined();
});
test("Not inserted Child Record should have NO id and giftId", async () => {
    const child = new ChildRecord({name: "Romek"});
    expect(child.id).toBeUndefined();
    expect(child.giftId).toBeUndefined();
});
test("Inserted ChildRecord DOES contains id and name", async () => {
    const child = new ChildRecord({name: "Romek"});
    await child.insert();
    expect(child.id).toBeDefined();
});
test("ChildRecord id is valid uuid", async () => {
    const child = new ChildRecord({name: "Romek"});
    await child.insert();
    expect(child.id).toMatch(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi);

});
