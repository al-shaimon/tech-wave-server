import mongoose from 'mongoose';
import { TErrorMessages, TGenericErrorResponse } from '../interface/error';

// validation error handle
const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorMessages: TErrorMessages = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: '',
        message: val?.message,
      };
    },
  );

  const statusCode = 400;
  return {
    statusCode,
    message: errorMessages[0].message,
    errorMessages: errorMessages,
  };
};

export default handleValidationError;
