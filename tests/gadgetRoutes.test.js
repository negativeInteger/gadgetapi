import { prisma } from "../api/config/db.js";
import { request } from "supertest";
import { app } from "../api/app.js";

describe('Gadget Routes', () => {
    // clean before each test
    beforeAll(async () => {
        await prisma.gadget.deleteMany();
    });

    it('should create a new gadget', async () => {
        const res = await request(app)
            .post('/api/gadgets')
            .send({
                name: 'gadgetname',
                description: 'good gadget',
                status: 'AVAILABLE'
            })
        expect(res.status).toBe(201);
        const gadget = await prisma.gadget.findUnique({
            where: { name: 'gadgetname' }
        });
        expect(gadget).not.toBeNull();
    });
    // Clean up after all tests
    afterAll(async () => {
        await prisma.gadget.deleteMany();  // Clean up test gadget data
    });
});