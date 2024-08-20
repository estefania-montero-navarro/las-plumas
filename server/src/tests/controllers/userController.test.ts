import { UserController } from "../../controllers/user";
import { UserService } from "../../services/user";
import { PasswordService } from "../../services/password";
import { Request, Response } from 'express';
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';

jest.mock('../../services/user');
jest.mock('../../services/password');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');


describe('UserController', () => {
  let userController: UserController;
  let userService: jest.Mocked<UserService>;
  let passwordService: jest.Mocked<PasswordService>;
  let req: Partial<Request>;
  let res: Partial<Response<any, Record<string, any>>>;

  beforeEach(() => {
    userService = new UserService() as jest.Mocked<UserService>;
    passwordService = new PasswordService() as jest.Mocked<PasswordService>;
    userController = new UserController();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Clear mock implementations
    jest.clearAllMocks();
    userService.getUserEmail.mockClear();
    passwordService.getPasswordByUUID.mockClear();

    // Mock bcrypt.compare to always return true
    bcrypt.compare = jest.fn().mockResolvedValue(true);
  });
  

  describe('login', () => {

    // TEST CASE: Empty user and password
    it('should return 401 if the user and password are empty', async () => {
      // Mock UserService to return undefined
      userService.getUserEmail.mockResolvedValueOnce(undefined);

      await userController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ status: 401, message: "Credenciales inválidas" });
    });

    // TEST CASE: Wrong password
    it('should return 401 if the credentials are invalid (wrong password)', async () => {
      interface UserDB {
        uuid: string;
        email: string;
        role: string;
        name: string;
        lastName: string;
        phone: string;
        bDate: Date;
        status: boolean;
        pass: string; // hashed password
      }
    
      interface Password {
        email: string;
        passwords: string; // Hashed password
      }
    
      const mockUser: UserDB = { 
        uuid: '123', 
        email: 'test@example.com', 
        role: 'user', 
        name: 'Test',
        lastName: 'Last',
        phone: '123456789',
        bDate: new Date(),
        status: true,
        pass: 'hashedPassword' 
      };

      // Mock UserService to return a valid user
      userService.getUserEmail.mockResolvedValueOnce(mockUser);

      // Mock PasswordService to return a valid password with a different hash
      const hashedPassword = await bcrypt.hash('wrongpassword', 10); // Hash a different password
      const mockPassword: Password = { 
        email: 'test@example.com', 
        passwords: hashedPassword 
      };
      passwordService.getPasswordByUUID.mockResolvedValueOnce(mockPassword);

      await userController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ status: 401, message: "Credenciales inválidas" });
    });

    // TEST CASE: Invalid credentials -> user does not exist
    it('should return 404 if the user is not found', async () => {
      userService.getUserEmail.mockResolvedValueOnce(undefined);

      await userController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ status: 401, message: "Credenciales inválidas" });
    });

    // TEST CASE: VALID CREDENTIALS
    it('should return 200 if the credentials are valid', async () => {
      interface UserDB {
        uuid: string;
        email: string;
        role: string;
        name: string;
        lastName: string;
        phone: string;
        bDate: Date;
        status: boolean;
        pass: string;
      }

      // Define the Password type
      interface Password {
        email: string;
        passwords: string;
      }

      // Mock UserService to return a valid user
      const mockUser: UserDB = {
        uuid: '123',
        email: 'test@example.com',
        role: 'user',
        name: 'Test',
        lastName: 'Last',
        phone: '123456789',
        bDate: new Date(),
        status: true,
        pass: 'hashedPassword'
      };

      userService.getUserEmail.mockResolvedValueOnce(mockUser); 

      // Generate a hashed password using bcrypt.hash
      const hashedPassword = await bcrypt.hash('password123', 10);

      // Mock PasswordService to return a valid password
      const mockPassword: Password = {
        email: 'test@example.com',
        passwords: hashedPassword
      };
      passwordService.getPasswordByUUID.mockResolvedValueOnce(mockPassword);

      // Mock bcrypt.compare to always return true
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Mock jwt.sign to return a dummy token
      const mockToken = 'dummyToken';
      (jwt.sign as jest.Mock).mockImplementation(() => mockToken);

      req.body = { email: 'test@example.com', password: 'password123' };

      await userController.login(req as Request, res as Response);

      console.log((res.status as jest.Mock).mock.calls);

      // Assert that status 200 is returned
      expect(res.status).toHaveBeenCalledWith(200);
      // Assert that the user data is returned in the response
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Autenticado con éxito",
        data: {
          token: mockToken,
          uuid: mockUser.uuid,
          email: mockUser.email,
          role: mockUser.role,
          name: mockUser.name,
        },
      });
    });


    // TEST CASE: Password meets the required criteria
    // TEST CASE: email meets the required criteria
    // TEST CASE: SQL injection
  });

  describe('updateUserStatus', () => {
    let userController: UserController;
    let userService: jest.Mocked<UserService>;
    let req: Partial<Request>;
    let res: Partial<Response<any, Record<string, any>>>;
    
    beforeEach(() => {
      userService = new UserService() as jest.Mocked<UserService>;
      userController = new UserController(userService);
      req = { params: { uuid: '123' } };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      // Clear mock implementations
      userService.updateUserStatus.mockClear();
    
      // Mock userService.updateUserStatus to return true or false based on test case
      userService.updateUserStatus.mockImplementation(async (uuid: string) => {
        if (uuid === '123') {
          return true; // Simulate user found
        } else {
          return false; // Simulate user not found
        }
      });
    });
    
    // TEST CASE: user status is updated successfully
    it('should return 200 if the user status is updated successfully', async () => {
      await userController.updateUserStatusJest(req as Request, res as Response);
    
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: "Usuario actualizado correctamente",
      });
    });
    
    // TEST CASE: user was not found 
    it('should return 404 if the user is not found', async () => {
      req.params = { uuid: '456' }; // Set UUID to simulate user not found
    
      await userController.updateUserStatusJest(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 404,
        message: "Usuario no encontrado",
      });
    });
  });
  
  });
  
  describe('UserController register', () => {
    // TEST CASE: User is successfully created  
    it('should return 201 if user is successfully created', async () => {
      const req = {
        body: { 
          email: 'test@example.com',
          password: 'password123',
          name: 'John',
          lastName: 'Doe',
          role: 'user',
          phone: '123456789',
          b_day: '1990-01-01'
        }
      } as Request; 
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
  
      const userService = {} as UserService; 
      const passwordService = {} as PasswordService;
  
      const userController = new UserController(userService, passwordService);
  
      await userController.register(req, res);
      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Usuario creado exitosamente',
      });
    });
  });

  describe('UserController sessionStatus', () => {
    it('should return 200 if session is active', async () => {
      const token = 'valid_token';
      const req = {
        headers: { authorization: token }
      } as Request; 
    
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
    
      const userServiceMock = {
        getSessionStatus: jest.fn().mockResolvedValue({ userId: '123', email: 'test@example.com' })
      };
    
      const userController = new UserController(userServiceMock as unknown as UserService, {} as PasswordService);
    
      await userController.sessionStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    
      expect(res.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Session is active',
        data: { userId: '123', email: 'test@example.com' }
      });
    });
  
    // TEST CASE: Session is not active (missing token)
    it('should return 401 if session token is missing', async () => {
      const req = {
        headers: { } // No token
      } as Request; 
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
  
      const userController = new UserController({} as UserService, {} as PasswordService);
  
      await userController.sessionStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
  
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: 'Session is not active',
      });
    });
  
    // TEST CASE: Session is not active (invalid token)
    it('should return 401 if session token is invalid', async () => {
      const token = 'invalid_token';
      const req = {
        headers: { authorization: token }
      } as Request; 
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
  
      const userService = {
        getSessionStatus: jest.fn().mockResolvedValue(undefined)
      } as unknown as UserService;
  
      const userController = new UserController(userService, {} as PasswordService);
  
      await userController.sessionStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
  
      expect(res.json).toHaveBeenCalledWith({
        status: 401,
        message: 'Session is not active',
      });
    });
  
    // TEST CASE: Internal server error
    it('should return 500 if internal server error occurs', async () => {
      const req = {} as Request; 
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
  
      const userService = {
        getSessionStatus: jest.fn().mockRejectedValue(new Error('Internal Server Error'))
      } as unknown as UserService;
      
  
      const userController = new UserController(userService, {} as PasswordService);
  
      await userController.sessionStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
  
      expect(res.json).toHaveBeenCalledWith({
        status: 500,
        message: 'Internal server error',
      });
    });
  });