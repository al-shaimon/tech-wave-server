/* eslint-disable prefer-const */
import { Query, Model, Schema } from 'mongoose';

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  private queryObj: Record<string, unknown>;
  private model: Model<T>;

  constructor(model: Model<T>, query: Record<string, unknown>) {
    this.model = model;
    this.modelQuery = model.find();
    this.queryObj = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.queryObj.searchTerm as string;
    if (searchTerm) {
      const searchConditions = searchableFields.map((field) => {
        if (this.model.schema.path(field) instanceof Schema.Types.String) {
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
    const queryObject = { ...this.queryObj };
    const excludeFields = ['searchTerm', 'sort', 'page', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObject[el]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.modelQuery = this.modelQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortBy = (this.queryObj.sort as string).split(',').join(' ');
      this.modelQuery = this.modelQuery.sort(sortBy);
    } else {
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
      const fields = (this.queryObj.fields as string).split(',').join(' ');
      this.modelQuery = this.modelQuery.select(fields);
    } else {
      this.modelQuery = this.modelQuery.select('-__v');
    }
    return this;
  }
}
