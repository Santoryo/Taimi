'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UsersController = void 0;
const database_1 = require('../../database/database');
const user_model_1 = require('./user.model');
const user_service_1 = require('./user.service');
const drizzle_orm_1 = require('drizzle-orm');
const tsoa_1 = require('tsoa');
let UsersController = class UsersController extends tsoa_1.Controller {
  /**
   * Create a user
   */
  async createUser(body, req) {
    const { apiKey = null } = body;
    if (!apiKey) {
      throw new Error('`apiKey` not found in body');
    }
    const user = await (0, user_service_1.createUserInDb)(apiKey, req.user.sub);
    this.setStatus(201);
    return user;
  }
  /**
   * Delete the authenticated user
   */
  async deleteUser(req) {
    const user = await database_1.db
      .delete(user_model_1.users)
      .where((0, drizzle_orm_1.eq)(user_model_1.users.auth_uid, req.user.sub))
      .returning();
    return user;
  }
};
exports.UsersController = UsersController;
__decorate(
  [
    (0, tsoa_1.Post)(),
    (0, tsoa_1.SuccessResponse)('201', 'Created'),
    (0, tsoa_1.Security)('supabase'),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
  ],
  UsersController.prototype,
  'createUser',
  null,
);
__decorate(
  [
    (0, tsoa_1.Delete)(),
    (0, tsoa_1.SuccessResponse)('200', 'Deleted'),
    (0, tsoa_1.Security)('supabase'),
    __param(0, (0, tsoa_1.Request)()),
  ],
  UsersController.prototype,
  'deleteUser',
  null,
);
exports.UsersController = UsersController = __decorate(
  [(0, tsoa_1.Route)('users'), (0, tsoa_1.Tags)('Users')],
  UsersController,
);
// export const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         if (!req.body) {
//             throw new Error("`apiKey` not found in body");
//         }
//         const { apiKey = null } = req.body;
//         const user = await createUserInDb(apiKey, req);
//         res.status(201).json(user);
//     } catch (error) {
//         next(error);
//     }
// };
// export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await db.delete(users).where(eq(req.user.id, users.auth_uid)).returning();
//         res.status(201).json(user);
//     } catch (error) {
//         next(error);
//     }
// }
