/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { savedObjectsClientMock } from '../../../../../../src/core/server/saved_objects/service/saved_objects_client.mock';
import { getAgentStatusById } from './status';
import { AGENT_TYPE_PERMANENT } from '../../../common/constants';
import { AgentSOAttributes } from '../../../common/types/models';
import { SavedObject } from 'kibana/server';

describe('Agent status service', () => {
  it('should return inactive when agent is not active', async () => {
    const mockSavedObjectsClient = savedObjectsClientMock.create();
    mockSavedObjectsClient.get = jest.fn().mockReturnValue({
      id: 'id',
      type: AGENT_TYPE_PERMANENT,
      attributes: {
        active: false,
        local_metadata: '{}',
        user_provided_metadata: '{}',
      },
    } as SavedObject<AgentSOAttributes>);
    const status = await getAgentStatusById(mockSavedObjectsClient, 'id');
    expect(status).toEqual('inactive');
  });

  it('should return online when agent is active', async () => {
    const mockSavedObjectsClient = savedObjectsClientMock.create();
    mockSavedObjectsClient.get = jest.fn().mockReturnValue({
      id: 'id',
      type: AGENT_TYPE_PERMANENT,
      attributes: {
        active: true,
        local_metadata: '{}',
        user_provided_metadata: '{}',
      },
    } as SavedObject<AgentSOAttributes>);
    const status = await getAgentStatusById(mockSavedObjectsClient, 'id');
    expect(status).toEqual('online');
  });
});
