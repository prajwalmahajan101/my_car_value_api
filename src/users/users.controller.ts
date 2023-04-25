import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {
  @Post('/signup')
  UserCreate(@Body() body: CreateUserDto) {
    console.log(body);
    return body;
  }
}
