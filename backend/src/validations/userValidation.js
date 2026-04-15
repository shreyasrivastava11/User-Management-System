import { z } from 'zod';
import { ROLES, USER_STATUS } from '../utils/constants.js';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const idParamSchema = z.object({
  body: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid user id')
  })
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(60),
    email: z.string().email(),
    password: z.string().min(8).optional(),
    role: z.enum([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]),
    status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE]).default(USER_STATUS.ACTIVE)
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({})
});

export const updateUserByAdminSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(60).optional(),
      email: z.string().email().optional(),
      role: z.enum([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]).optional(),
      status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE]).optional(),
      password: z.string().min(8).optional()
    })
    .refine((v) => Object.keys(v).length > 0, {
      message: 'At least one field is required'
    }),
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid user id')
  }),
  query: z.object({}).optional().default({})
});

export const updateOwnProfileSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(60).optional(),
      password: z.string().min(8).optional()
    })
    .refine((v) => Object.keys(v).length > 0, {
      message: 'At least one field is required'
    }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({})
});

export const listUsersSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    q: z.string().trim().optional().default(''),
    role: z.enum([ROLES.ADMIN, ROLES.MANAGER, ROLES.USER]).optional(),
    status: z.enum([USER_STATUS.ACTIVE, USER_STATUS.INACTIVE]).optional()
  })
});
