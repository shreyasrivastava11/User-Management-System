import { Router } from 'express';
import {
  createUser,
  deactivateUser,
  getMyProfile,
  getUserById,
  listUsers,
  updateMyProfile,
  updateUser
} from '../controllers/userController.js';
import { authorize, protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createUserSchema,
  idParamSchema,
  listUsersSchema,
  updateOwnProfileSchema,
  updateUserByAdminSchema
} from '../validations/userValidation.js';
import { ROLES } from '../utils/constants.js';

const router = Router();

router.use(protect);

router.get('/me', getMyProfile);
router.patch('/me', validate(updateOwnProfileSchema), updateMyProfile);

router.get('/', authorize(ROLES.ADMIN, ROLES.MANAGER), validate(listUsersSchema), listUsers);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.MANAGER), validate(idParamSchema), getUserById);

router.post('/', authorize(ROLES.ADMIN), validate(createUserSchema), createUser);
router.patch('/:id', authorize(ROLES.ADMIN, ROLES.MANAGER), validate(updateUserByAdminSchema), updateUser);
router.delete('/:id', authorize(ROLES.ADMIN), validate(idParamSchema), deactivateUser);

export default router;
