//import { generateJWT, verifyJwtToken, UserPayload } 

import { generateJWT, Userpayload, verifyJwtToken } from "../helpers";

describe('Token Generation and Verification', () => {
  it('should generate a valid JWT token', () => {
    const payload: Userpayload = {
      id: '12345',
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
    };
    const token = generateJWT(payload);
    expect(token).toBeTruthy();

    const decodedPayload = verifyJwtToken(token);
    expect(decodedPayload.id).toBe(payload.id);
    expect(decodedPayload.email).toBe(payload.email);
   
  });

  it('should verify a valid JWT token', () => {
    const payload: Userpayload= {
      id: '12345',
      email: 'test@example.com',
      firstname: 'John',
      lastname: 'Doe',
    };
    const token = generateJWT(payload);
    const decodedPayload = verifyJwtToken(token);
    expect(decodedPayload.id).toBe(payload.id);
    expect(decodedPayload.email).toBe(payload.email);
  });
});
