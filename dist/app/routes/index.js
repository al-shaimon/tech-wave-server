"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const postCategory_route_1 = require("../modules/PostCategory/postCategory.route");
const post_route_1 = require("../modules/Post/post.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: user_route_1.AuthRoutes,
    },
    {
        path: '/post-categories',
        route: postCategory_route_1.PostCategoryRoutes,
    },
    {
        path: '/posts',
        route: post_route_1.PostRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
