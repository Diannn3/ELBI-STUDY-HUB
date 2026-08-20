import { describe, expect, it } from 'vitest';
import { toCloudPayload } from '../serialize';
import type { SyncMutation } from '../../db/schema';

describe('outbox serialization', () => {
  it('maps camelCase fields and replaces local user identity', () => {
    const m: SyncMutation={id:'m',entityType:'task',entityId:'t',operation:'upsert',createdAt:1,attemptCount:0,payload:{id:'t',userId:'local-user',courseId:'c',updatedAt:123,title:'x'}};
    expect(toCloudPayload(m,'00000000-0000-0000-0000-000000000001')).toMatchObject({id:'t',user_id:'00000000-0000-0000-0000-000000000001',course_id:'c',updated_at:123,title:'x'});
  });
});
