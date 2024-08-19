import dotenv from 'dotenv';

dotenv.config();


export const LoginData = {
    email: process.env.EMAIL || '',
    password: process.env.PASSWORD || '',
};