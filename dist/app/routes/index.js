"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const postCategory_route_1 = require("../modules/PostCategory/postCategory.route");
const post_route_1 = require("../modules/Post/post.route");
const comment_route_1 = require("../modules/Comment/comment.route");
const analytics_route_1 = require("../modules/Analytics/analytics.route");
const payment_route_1 = require("../modules/Payment/payment.route");
const activityLogs_route_1 = require("../modules/ActivityLogs/activityLogs.route");
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
    {
        path: '/comments',
        route: comment_route_1.CommentRoutes,
    },
    {
        path: '/analytics',
        route: analytics_route_1.AnalyticsRoutes,
    },
    {
        path: '/payments',
        route: payment_route_1.PaymentRoutes,
    },
    {
        path: '/activity-logs',
        route: activityLogs_route_1.ActivityLogRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
// router.use('/comments', CommentRoutes);
exports.default = router;
