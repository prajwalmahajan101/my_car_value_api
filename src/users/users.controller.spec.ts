import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdas',
        } as User),
      find: (email: string) =>
        Promise.resolve([
          {
            id: 1,
            email,
            password: 'asdas',
          } as User,
        ]),
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      signIn: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
      // signUp: () => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUser('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('finUser returns a single users witha given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws if the user is not Found', async () => {
    fakeUsersService.findOne = () => Promise.resolve(null);
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('Signin returns the user and startes the Session', async () => {
    const session = { userId: null };
    const user = await controller.signInUser(
      {
        email: 'asdf@asdf.com',
        password: 'asdf',
      },
      session,
    );
    expect(session.userId).toEqual(1);
    expect(user.id).toEqual(1);
  });

  it('SignOut updated the Session', async () => {
    const session = { userId: -100 };
    await controller.signOut(session);
    expect(session.userId).toEqual(null);
  });
});
