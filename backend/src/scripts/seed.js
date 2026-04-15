import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { ROLES, USER_STATUS } from '../utils/constants.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Missing MONGO_URI in environment');
}

const seedUsers = [
  {
    name: 'System Admin',
    email: 'admin@example.com',
    password: 'Admin@1234',
    role: ROLES.ADMIN,
    status: USER_STATUS.ACTIVE
  },
  {
    name: 'Team Manager',
    email: 'manager@example.com',
    password: 'Manager@1234',
    role: ROLES.MANAGER,
    status: USER_STATUS.ACTIVE
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'User@1234',
    role: ROLES.USER,
    status: USER_STATUS.ACTIVE
  }
];

(async () => {
  try {
    await mongoose.connect(MONGO_URI);

    for (const u of seedUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
      }
    }

    // Keep seeded default users as N/A in audit fields.
    await User.updateMany(
      { email: { $in: seedUsers.map((u) => u.email) } },
      { $set: { createdBy: null, updatedBy: null } }
    );

    // eslint-disable-next-line no-console
    console.log('Seed complete');
    await mongoose.disconnect();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
})();
