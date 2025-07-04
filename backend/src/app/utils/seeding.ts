import config from '../config';
import { ROLE } from '../modules/User/user.constant';
import User from '../modules/User/user.model';
import { Logger } from './logger';
import bcrypt from 'bcryptjs';

const seedingAdmin = async () => {
  try {
    // at first check if the admin exist of not
    const admin = await User.findOne({
      role: ROLE.ADMIN,
      email: config.super_admin.email,
    });
    if (!admin) {
      const hashPassword = await bcrypt.hash(
        config.super_admin.password!,
        Number(config.bcrypt_salt_rounds)
      );
      await User.create({
        fullName: 'Admin',
        role: ROLE.ADMIN,
        email: config.super_admin.email,
        password: hashPassword,
      });
    }
  } catch {
    Logger.error('Error seeding admin');
  }
};

export default seedingAdmin;
