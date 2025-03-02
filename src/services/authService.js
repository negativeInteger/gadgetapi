import { prisma } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';

export const register = async (data) => {
    const  { username, password } = data;
    const hashedPassword = await hashPassword(password);
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: data.role || 'agent'
            }
        });
    } catch (err) {
        console.error('Error registering user', err);
        throw new Error('DATABASE ERROR')
    }
    

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    return { accessToken, refreshToken };
};