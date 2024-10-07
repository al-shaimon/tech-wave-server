import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';

const UserSchema: Schema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    password: { type: String, required: true, select: 0 },
    phone: { type: String, default: '' },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    profilePhoto: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
  },
  { timestamps: true }
);

export const User = model<TUser>('User', UserSchema);
