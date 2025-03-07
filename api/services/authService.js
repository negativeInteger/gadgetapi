import { prisma } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';
import { saveRefreshToken } from '../models/refreshToken.js';
import { REFRESH_TOKEN_EXPIRE_TIME } from '../config/expirationTimes.js';
/**
 * Register Service
 * Saves User Credentials + Generates JWT Tokens
 */
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
        throw new Error('DATABASE ERROR');
    }
    return
};
/**
 * Login Service
 * Validates User Credentials + Generates JWT Tokens
 */
export const login = async ({ username, password }, device, ipAddress) => {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error('Invalid Credentials');

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) throw new Error('Invalid Credentials');

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await saveRefreshToken(refreshToken, user.id, device, ipAddress, new Date(Date.now() + REFRESH_TOKEN_EXPIRE_TIME))

    return { user, accessToken, refreshToken };
};
