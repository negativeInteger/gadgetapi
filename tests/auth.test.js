import { request } from "supertest";
import { app } from "../src/app.js";

describe('Auth API', () => {
    it('should login user', async () => {
        const res = await request(app).post('/auth/login').send({
            username: 'monkeydluffy',
            password: 'password'
        });
        expect(res.status).toBe(200);
    });
});