import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  github_token: process.env.GITHUB_TOKEN,
  redis_url: process.env.REDIS_URL,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  client_url: process.env.CLIENT_URL,
  backend_url: process.env.BACKEND_URL,
  contact_us_email: process.env.CONTACT_US_EMAIL,
  nodemailer: {
    email: process.env.EMAIL_FOR_NODEMAILER,
    password: process.env.PASSWORD_FOR_NODEMAILER,
  },
  super_admin: {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
    profile_photo: process.env.SUPER_ADMIN_PROFILE_PHOTO,
  },
};
