"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSearchableFields = exports.USER_STATUS = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    admin: 'admin',
    user: 'user',
};
exports.USER_STATUS = {
    ACTIVE: 'ACTIVE',
    BLOCKED: 'BLOCKED',
};
exports.UserSearchableFields = [
    'name',
    'email',
    'phone',
    'role',
    'status',
];
