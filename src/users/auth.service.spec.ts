import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      find: (email: string) => {
        const filteredUser = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUser);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999) + 1,
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('Can create an instance of auth Service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new userswith salted and hased passwords', async () => {
    const user = await service.signUp('asdf@asdf.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs Up with a email that is in use already', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { id: 1, email: 'asdf@asdf.com', password: 'asdf' } as User,
      ]);
    // await service.signUp('asdf@asdf.com', 'asdf');
    await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('thorws an error if signin is called with a unused email', async () => {
    await expect(service.signIn('asd@asd.com', 'asd')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an valid password is provided', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { id: 1, email: 'asdf@asdf.com', password: 'asdf' } as User,
      ]);

    await expect(service.signIn('asdf@asdf.com', '123454')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('retruning a user if the correct password is provided', async () => {
    await service.signUp('asdf@asdf.com', 'asdf');
    const user = await service.signIn('asdf@asdf.com', 'asdf');
    expect(user).toBeDefined();
  });
});
