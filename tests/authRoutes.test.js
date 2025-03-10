import { prisma } from '../api/config/db';
import { request } from 'supertest';
import { app } from '../api/app';

describe('Auth Routes', () => {
    // Before each test clean up the testDB
    beforeAll(async () => {
        await prisma.user.deleteMany();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('api/auth/register')
            .send({
                username: 'testusername',
                password: 'password123'
            });
        expect(res.status).toBe(201);
        const user = prisma.user.findUnique({
            where: { username: 'testusername' }
        });
        expect(user).not.toBeNull();
    });

    it('should not register an existing user', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testusername',
                password: 'password123'
            });
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testusername',
                password: 'password123'
            });
        expect(res.status).toBe(409);
    });
});