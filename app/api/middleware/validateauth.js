import jwt from 'jsonwebtoken';

export const validateToken = (token) => {
    try {
    const secretkey = process.env.SECRETKEY
    
    if (!token) {        
        throw new Error('No token provided')
        // return res.status(401).json({ message: 'No token provided' });
    }    
        const decoded = jwt.verify(token, secretkey);
        return decoded

    } catch (err) {
        throw new Error('Invalid token');
    }
};