/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { wrapError } from '../client/error_wrapper';
import { RouteInitialization } from '../types';
import { jobAuditMessagesProvider } from '../models/job_audit_messages';
import { jobAuditMessagesQuerySchema, jobIdSchema } from './schemas/job_audit_messages_schema';

/**
 * Routes for job audit message routes
 */
export function jobAuditMessagesRoutes({ router, mlLicense }: RouteInitialization) {
  /**
   * @apiGroup JobAuditMessages
   *
   * @api {get} /api/ml/job_audit_messages/messages/:jobId Get audit messages
   * @apiName GetJobAuditMessages
   * @apiDescription Returns audit messages for specified job ID
   *
   * @apiSchema (params) jobIdSchema
   * @apiSchema (query) jobAuditMessagesQuerySchema
   */
  router.get(
    {
      path: '/api/ml/job_audit_messages/messages/{jobId}',
      validate: {
        params: jobIdSchema,
        query: jobAuditMessagesQuerySchema,
      },
    },
    mlLicense.fullLicenseAPIGuard(async (context, request, response) => {
      try {
        const { getJobAuditMessages } = jobAuditMessagesProvider(
          context.ml!.mlClient.callAsCurrentUser
        );
        const { jobId } = request.params;
        const { from } = request.query;
        const resp = await getJobAuditMessages(jobId, from);

        return response.ok({
          body: resp,
        });
      } catch (e) {
        return response.customError(wrapError(e));
      }
    })
  );

  /**
   * @apiGroup JobAuditMessages
   *
   * @api {get} /api/ml/job_audit_messages/messages Get all audit messages
   * @apiName GetAllJobAuditMessages
   * @apiDescription Returns all audit messages
   *
   * @apiSchema (query) jobAuditMessagesQuerySchema
   */
  router.get(
    {
      path: '/api/ml/job_audit_messages/messages',
      validate: {
        query: jobAuditMessagesQuerySchema,
      },
    },
    mlLicense.fullLicenseAPIGuard(async (context, request, response) => {
      try {
        const { getJobAuditMessages } = jobAuditMessagesProvider(
          context.ml!.mlClient.callAsCurrentUser
        );
        const { from } = request.query;
        const resp = await getJobAuditMessages(undefined, from);

        return response.ok({
          body: resp,
        });
      } catch (e) {
        return response.customError(wrapError(e));
      }
    })
  );
}
