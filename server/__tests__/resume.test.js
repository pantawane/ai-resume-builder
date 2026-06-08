import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const res = await request(app)
    .post('/api/users/register')
    .send({
      name: 'Vansh Test',
      email: 'vansh@test.com',
      password: 'password123'
    });

  token = res.body.token;
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  const res = await request(app)
    .post('/api/users/register')
    .send({
      name: 'Vansh Test',
      email: 'vansh@test.com',
      password: 'password123'
    });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/resumes/create', () => {

  test('✅ should create a new resume', async () => {
    const res = await request(app)
      .post('/api/resumes/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Test Resume' });

    expect(res.status).toBe(201);
    expect(res.body.resume.title).toBe('My Test Resume');
    expect(res.body.resume._id).toBeDefined();
  });

  test('❌ should fail without auth token', async () => {
    const res = await request(app)
      .post('/api/resumes/create')
      .send({ title: 'My Test Resume' });

    expect(res.status).toBe(401);
  });

});

describe('GET /api/resumes/get/:id', () => {

  test('✅ should get resume by id', async () => {
    const createRes = await request(app)
      .post('/api/resumes/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Resume' });

    const resumeId = createRes.body.resume._id;

    const res = await request(app)
      .get(`/api/resumes/get/${resumeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.resume._id).toBe(resumeId);
  });

  test('❌ should fail with invalid resume id', async () => {
    const res = await request(app)
      .get('/api/resumes/get/invalidid123')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

});

describe('DELETE /api/resumes/delete/:id', () => {

  test('✅ should delete resume successfully', async () => {
    const createRes = await request(app)
      .post('/api/resumes/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Resume to Delete' });

    const resumeId = createRes.body.resume._id;

    const res = await request(app)
      .delete(`/api/resumes/delete/${resumeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });

});