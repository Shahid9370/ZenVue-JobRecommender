const request = require('supertest');
const app = require('../app');

describe('Basic API tests', () => {
  it('GET /api should return 200', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toBe(200);
  });
});
