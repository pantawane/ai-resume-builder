import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

// ✅ Connect to test database before all tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

// ✅ Clean up test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// ✅ Disconnect after all tests done
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// ============================================
// REGISTER TESTS
// ============================================

describe('POST /api/users/register', () => {

  test('✅ should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Vansh Pantawane',
        email: 'vansh@test.com',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('vansh@test.com');
    expect(res.body.user.password).toBeUndefined(); // password should not be returned
  });

  test('❌ should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: 'vansh@test.com'
        // missing name and password
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('All fields are required');
  });

  test('❌ should fail with short password', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Vansh',
        email: 'vansh@test.com',
        password: '123' // less than 6 chars
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Password must be at least 6 characters');
  });

  test('❌ should fail with invalid email', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Vansh',
        email: 'notanemail',
        password: 'password123'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Please enter a valid email');
  });

  test('❌ should fail if email already exists', async () => {
    // Register first time
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Vansh',
        email: 'vansh@test.com',
        password: 'password123'
      });

    // Register second time with same email
    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Vansh',
        email: 'vansh@test.com',
        password: 'password123'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email already registered. Please login.');
  });

});

// ============================================
// LOGIN TESTS
// ============================================

describe('POST /api/users/login', () => {

  // Register a user before login tests
  beforeEach(async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Vansh Pantawane',
        email: 'vansh@test.com',
        password: 'password123'
      });
  });

  test('✅ should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'vansh@test.com',
        password: 'password123'
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.message).toBe('Login successful!');
  });

  test('❌ should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'vansh@test.com',
        password: 'wrongpassword'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid email or password');
  });

  test('❌ should fail with non-existent email', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'notexist@test.com',
        password: 'password123'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid email or password');
  });

  test('❌ should fail with missing fields', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'vansh@test.com'
        // missing password
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email and password are required');
  });

});

// ============================================
// PROTECTED ROUTE TESTS
// ============================================

describe('GET /api/users/data', () => {

  test('❌ should fail without token', async () => {
    const res = await request(app)
      .get('/api/users/data');

    expect(res.status).toBe(401);
  });

  test('❌ should fail with invalid token', async () => {
    const res = await request(app)
      .get('/api/users/data')
      .set('Authorization', 'Bearer invalidtoken123');

    expect(res.status).toBe(401);
  });

  test('✅ should return user data with valid token', async () => {
    // First register and get token
    const registerRes = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Vansh Pantawane',
        email: 'vansh@test.com',
        password: 'password123'
      });

    const token = registerRes.body.token;

    // Now get user data
    const res = await request(app)
      .get('/api/users/data')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('vansh@test.com');
    expect(res.body.user.password).toBeUndefined();
  });

});