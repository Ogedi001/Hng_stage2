import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import app from '../app';

describe('Authentication Endpoints', () => {

  it('should register user successfully with default organisation', async () => {
    jest.setTimeout(10000); // Increase timeout to 10 seconds
  
    const userData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '1234567890'
    };
  

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);
  
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
  }, 10000); // Also increase timeout here
  

  it('should log the user in successfully with valid credentials', async () => {
    const loginData = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app).post('/auth/login').send(loginData);

    console.log(response.body); // Add this line to debug the response

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('Login successful');
    expect(response.body.data.accessToken).toBeTruthy();
    expect(response.body.data.user).toBeTruthy();
    expect(response.body.data.user.password).toBeUndefined(); // Ensure password is not returned
  });

  it('should fail if required fields are missing', async () => {
    const invalidUserData = {
      firstname: 'John',
      lastname: 'Doe',
      // Missing email, password, phone
    };

    const response = await request(app).post('/auth/register').send(invalidUserData);

    expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body.errors).toBeTruthy();
  });

  
  it('should fail if there\'s a duplicate email or UserID', async () => {
    const userData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '1234567890'
    };
  
    await request(app)
      .post('/api/auth/register')
      .send(userData);
  
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);
  
    expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body.errors).toBeTruthy();
  });
  
});
