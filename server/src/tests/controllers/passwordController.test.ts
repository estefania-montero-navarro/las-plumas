import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from "../../services/user";
import { PasswordService } from "../../services/password";
import { ConfirmationEmailService } from "../../services/confirmationEmail";
import { PasswordController } from '../../controllers/password'; // Adjust the import path as per your file structure

jest.mock('../../services/user');
jest.mock('../../services/password');
jest.mock('../../services/confirmationEmail');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('uuid');

describe('PasswordController', () => {
  let passwordController: PasswordController;
  let userService: jest.Mocked<UserService>;
  let passwordService: jest.Mocked<PasswordService>;
  let confirmationEmailService: jest.Mocked<ConfirmationEmailService>;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    userService = new UserService() as jest.Mocked<UserService>;
    passwordService = new PasswordService() as jest.Mocked<PasswordService>;
    confirmationEmailService = new ConfirmationEmailService() as jest.Mocked<ConfirmationEmailService>;
    passwordController = new PasswordController(userService, passwordService, confirmationEmailService);

    req = { body: { email: 'test@example.com' } } as Request;
    res = {
      status: jest.fn().mockReturnThis(), // Mock status function to return itself
      json: jest.fn(), // Mock json function
    } as unknown as Response;

    jest.clearAllMocks();
    userService.getUserEmail.mockClear();
    passwordService.getPasswordByUUID.mockClear();

    // Mock bcrypt.compare to always return true
    bcrypt.compare = jest.fn().mockResolvedValue(true);

  });

  describe('rememberPassword', () => {
    
    // Missing email parameter
    it('should return 406 if email is missing', async () => {
      
      const req = { body: {} } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await passwordController.rememberPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.json).toHaveBeenCalledWith({
        status: 406,
        message: 'Missing parameters',
      });

      
    });

    // User not found
    it('should return 406 if user is not found', async () => {
      userService.getUserEmail.mockResolvedValueOnce(undefined); // User not found
  
      const req = { body: { email: 'nonexistent@example.com' } } as Request;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;
  
      await passwordController.rememberPassword(req, res);
  
      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.json).toHaveBeenCalledWith({ status: 406, message: 'User not found' });
    });


     it('should return 202 if email is sent successfully', async () => {
      // Mocking confirmation email service to return true for email sent
      confirmationEmailService.sendConfirmationEmail.mockResolvedValueOnce(true);

      await passwordController.rememberPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(202);
      expect(res.json).toHaveBeenCalledWith({ status: 202, message: 'Email sent successfully' });
    });
    

  });

  describe('verifyOldPassword', () => {

    it('should return 406 if email or oldPassword is missing', async () => {
      const req = { body: {} } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await passwordController.verifyOldPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.json).toHaveBeenCalledWith({
        status: 406,
        message: 'Missing parameters',
      });
    });

    it('should return 406 if user is not found', async () => {
      userService.getUserEmail.mockResolvedValueOnce(undefined); // User not found
  
      const req = { body: { email: 'nonexistent@example.com', oldPassword: 'oldPassword' } } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      await passwordController.verifyOldPassword(req, res);
  
      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.json).toHaveBeenCalledWith({
        status: 406,
        message: 'User not found',
      });
    });

    // TEST Return 406 if password does not match

    // TEST Return 200 if password matches

    // Add more test cases for verifyOldPassword
  });

  describe('updatePassword', () => {
    it('should return 406 if email or newPassword is missing', async () => {
      const req = { body: {} } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await passwordController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.json).toHaveBeenCalledWith({
        status: 406,
        message: 'Missing parameters',
      });
    });

    it('should return 406 if error hashing password', async () => {
      userService.getUserEmail.mockResolvedValueOnce(undefined); // User not found

      const req = { body: { email: 'nonexistent@example.com', newPassword: 'newPassword' } } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await passwordController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.json).toHaveBeenCalledWith({
        status: 406,
        message: 'Error hashing password',
      });
    });

    it('should return 406 if newPassword is missing', async () => {
      const req = { body: { email: 'test@example.com' } } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await passwordController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.json).toHaveBeenCalledWith({
        status: 406,
        message: 'Missing parameters',
      });
    });

    it('should return 406 if email is missing', async () => {
      const req = { body: { newPassword: 'newPassword' } } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await passwordController.updatePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(406);
      expect(res.json).toHaveBeenCalledWith({
        status: 406,
        message: 'Missing parameters',
      });
    });
    
  });
});
