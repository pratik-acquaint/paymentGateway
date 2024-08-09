import jwt from 'jsonwebtoken';

export const validateToken = (token) => {
    const secretkey = process.env.SECRETKEY

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, secretkey);
        return decoded

    } catch (err) {
        throw new Error('Invalid token');
    }
};