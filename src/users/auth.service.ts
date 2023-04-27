import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(email: string, password: string) {
    // Find if the email is already Taken
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('Email is already Taken');
    }

    // Create salt
    const salt = randomBytes(32).toString('hex');
    // Hash Password and Salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // add salt and password and save that to db
    const result = salt + '.' + hash.toString('hex');
    const user = await this.userService.create(email, result);
    // return User
    return user;
  }

  async signIn(email: string, password: string) {
    // Find the User with the emailId
    const [user] = await this.userService.find(email);
    // If User not Found throw a Not Found Exception
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    // remove the salt and hashed passowrd from the user
    const [salt, storedHash] = user.password.split('.');
    // recreate the Hashed and salted Password
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong Password');
    }
    return user;
  }
}
