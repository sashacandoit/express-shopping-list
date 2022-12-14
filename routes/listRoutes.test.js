process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const items = require("../fakeDb");

beforeEach(function () {
    items.length = 0;
})

test('GET /items - gets a list of our items', async () => {
    items.push({
        name: "test item",
        price: 2.75
    })
    const res = await request(app).get('/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{name: "test item", price: 2.75}])
})

test('POST /items - adds an item to our list of items', async () => {
    const res = await request(app)
        .post('/items')
        .send({
            name: "test item",
            price: 2.75
        });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
        added: {
            name: "test item",
            price: 2.75
        }
    });
})

describe('GET /items/:name', () => {
    test('get single item by name from list of items', async () => {
        items.push({
            name: "test-item",
            price: 2.75
        })
        const res = await request(app).get('/items/test-item');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ name: "test-item", price: 2.75 })
    })
    test('responds with 404 if name not in list of items', async () => {
        const res = await request(app).get('/items/nope');
        expect(res.statusCode).toBe(404);
    })
})

describe('PATCH /items/:name', () => {
    test('update single item in list', async () => {
        items.push({
            name: "test-item",
            price: 2.75
        })
        const res = await request(app)
            .patch('/items/test-item')
            .send({
                name: "test-item-2",
                price: 22.75
            })
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            updated: {
                name: "test-item-2",
                price: 22.75
            }
        })
    })
    test('responds with 404 if item name not in list of items', async () => {
        const res = await request(app).get('/items/nope');
        expect(res.statusCode).toBe(404);
    })
})

describe('DELETE /items/:name', () => {
    test('delete single item from list of items', async () => {
        items.push({
            name: "test-item",
            price: 2.75
        })
        const res = await request(app).delete("/items/test-item")
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ message: "test-item DELETED" });
    })
    test('responds with 404 if item name not in list of items', async () => {
        const res = await request(app).get('/items/nope');
        expect(res.statusCode).toBe(404);
    })
})
