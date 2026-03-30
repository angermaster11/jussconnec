/**
 * Standard API response format
 * { success: boolean, data: any, message: string, pagination?: object }
 */

export const apiResponse = (res, statusCode, data = null, message = '', pagination = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

export const successResponse = (res, data = null, message = 'Success', statusCode = 200, pagination = null) => {
  return apiResponse(res, statusCode, data, message, pagination);
};

export const errorResponse = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

export const paginationMeta = (total, cursor, limit, hasMore) => ({
  total,
  cursor,
  limit,
  hasMore,
});
