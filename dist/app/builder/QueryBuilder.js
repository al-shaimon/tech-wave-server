"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
/* eslint-disable prefer-const */
const mongoose_1 = require("mongoose");
class QueryBuilder {
    constructor(model, query) {
        this.model = model;
        this.modelQuery = model.find();
        this.queryObj = query;
    }
    search(searchableFields) {
        const searchTerm = this.queryObj.searchTerm;
        if (searchTerm) {
            const searchConditions = searchableFields.map((field) => {
                if (this.model.schema.path(field) instanceof mongoose_1.Schema.Types.String) {
                    return { [field]: { $regex: searchTerm, $options: 'i' } };
                }
                return {};
            }).filter(condition => Object.keys(condition).length > 0);
            if (searchConditions.length > 0) {
                this.modelQuery = this.modelQuery.find({ $or: searchConditions });
            }
        }
        return this;
    }
    filter() {
        const queryObject = Object.assign({}, this.queryObj);
        const excludeFields = ['searchTerm', 'sort', 'page', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObject[el]);
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.modelQuery = this.modelQuery.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if (this.queryObj.sort) {
            const sortBy = this.queryObj.sort.split(',').join(' ');
            this.modelQuery = this.modelQuery.sort(sortBy);
        }
        else {
            this.modelQuery = this.modelQuery.sort('-createdAt');
        }
        return this;
    }
    paginate() {
        const page = Number(this.queryObj.page) || 1;
        const limit = Number(this.queryObj.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        if (this.queryObj.fields) {
            const fields = this.queryObj.fields.split(',').join(' ');
            this.modelQuery = this.modelQuery.select(fields);
        }
        else {
            this.modelQuery = this.modelQuery.select('-__v');
        }
        return this;
    }
}
exports.QueryBuilder = QueryBuilder;
