import { getSchemaClient } from '../get-schema-client';
import fetch from 'jest-fetch-mock';

describe('getSchemaClient', () => {
  it('should have request payload', async () => {
    const mock = fetch.mockResponseOnce(JSON.stringify({}));
    await getSchemaClient({ type: 'MyType' });
    expect(mock).toHaveBeenCalledWith('http://localhost/getSchema', {
      body: '{"type":"MyType"}',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: 'post',
    });
  });
});