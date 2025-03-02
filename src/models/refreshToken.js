import { prisma } from "../config/db.js";

export const saveRefreshToken = async (token, userId, device, ipAddress, expiresAt) => {
    return await prisma.refreshToken.create({
        data: {
            token,
            userId,
            device,
            ipAddress,
            expiresAt
        }
    });
};


export const blacklistToken = async (token) => {
    return await prisma.refreshToken.updateMany({
        where: { token },
        data: {
            blacklisted: true,
            revokedAt: new Date()
        }
    });
};


export const isBlacklisted = async (token) => {
    const blacklisted = await prisma.refreshToken.findFirst({
        where: { token, blacklisted: true }
    });
    return !!blacklisted;   // double NOT operator
};