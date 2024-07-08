import request from 'supertest';
 // Assuming you export your Express app instance
import { StatusCodes } from 'http-status-codes';
import app from '../app'

describe('Authentication Endpoints', () => {
  let accessToken: string;

  beforeAll(() => {
    // Assuming you have a setup function to get the access token for testing
    accessToken = 'your_generated_access_token';
  });

  it('should register user successfully with default organisation', async () => {
    const userData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '1234567890',
    };

    const response = await request(app).post('/auth/register').send(userData);

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body.status).toBe('Success');
    expect(response.body.message).toBe('Registration successful');
    expect(response.body.data.accessToken).toBeTruthy();
    expect(response.body.data.user).toBeTruthy();
    expect(response.body.data.user.organisations).toBeTruthy();
    expect(response.body.data.user.organisations.name).toBe("John's Organisation");
  });

  it('should log the user in successfully with valid credentials', async () => {
    const loginData = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const response = await request(app).post('/auth/login').send(loginData);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.status).toBe('Success');
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
    // Add assertions for specific error messages or fields
  });

  it('should fail if there\'s a duplicate email or UserID', async () => {
    // Mock scenario where a user with the same email already exists
    const duplicateUserData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phone: '1234567890',
    };

    const response = await request(app).post('/auth/register').send(duplicateUserData);

    expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(response.body.errors).toBeTruthy();
    // Add assertions for specific error messages or fields
  });
});
