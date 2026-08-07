/**
 * responseHandler.js
 * @description :: exports all handlers for response format.
 */

const message = require('./messages');

/**
 *
 * @param {obj} req : request from controller.
 * @param {obj} res : response from controller.
 * @param {*} next : executes the middleware succeeding the current middleware.
 */
const responseHandler = (req, res, next) => {
  res.ok = (data = {}) => {
    message.successResponse(data, res);
  };

  res.noContent = (data = {}) => {
    message.noContent(data, res);
  };

  res.badRequest = (data = {}) => {
    message.badRequest(data, res);
  };

  res.failureResponse = (data = {}) => {
    message.failureResponse(data, res);
  };

  res.insufficientParameters = (data = {}) => {
    message.insufficientParameters(data, res);
  };

  res.unAuthorizedRequest = (data = {}) => {
    message.unAuthorizedRequest(data, res);
  };

  res.accessForbidden = (data = {}) => {
    message.accessForbidden(data, res);
  };

  res.notFound = (data = {}) => {
    message.notFound(data, res);
  };

  res.unProcessable_entity = (data = {}) => {
    message.unProcessable_entity(data, res);
  };

  res.badGateway = (data = {}) => {
    message.badGateway(data, res);
  };

  res.payment_required = (data = {}) => {
    message.payment_required(data, res);
  };

  next();
};

module.exports = responseHandler;
