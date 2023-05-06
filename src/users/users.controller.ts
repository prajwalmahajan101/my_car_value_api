import {
  Controller,
  Post,
  Body,
  Get,
  Session,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
// import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiProduces('application/json')
@ApiTags('Auth')
@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ description: 'Register the User' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'User is Registered',
    type: UserDto,
  })
  @ApiConflictResponse({
    description: 'Email Already Taken',
  })
  @ApiBadRequestResponse({ description: 'Input Not Correct' })
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @ApiOperation({ description: "SignIn's the User" })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'User Logged In', type: UserDto })
  @ApiBadRequestResponse({ description: 'Input Not Correct' })
  @ApiUnauthorizedResponse({ description: 'Password Wrong' })
  @ApiNotFoundResponse({ description: 'User Not Found' })
  @Post('/signin')
  async signInUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   const id = session.userId;
  //   if (!id) {
  //     throw new BadRequestException('User Not Signin');
  //   }
  //   return this.userService.findOne(session.userId);
  // }

  @Get('/whoami')
  @ApiOperation({ description: "Get's the Logged in User" })
  @UseGuards(AuthGuard)
  @ApiForbiddenResponse({ description: 'User Not Logged In' })
  @ApiOkResponse({ description: 'Logged in User' })
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Get('/signout')
  @ApiOperation({ description: 'Log out the Logged in User' })
  @ApiOkResponse({ description: 'User Logged Out' })
  @ApiBadRequestResponse({ description: 'User not Logged in' })
  signOut(@Session() session: any) {
    if (!session.userId) {
      throw new BadRequestException('User not Logged in');
    }
    session.userId = null;
  }

  // @ApiTags('Useless')
  // @Get('/:id')
  // async findUser(@Param('id') id: string) {
  //   const user = await this.userService.findOne(parseInt(id));
  //   if (!user) {
  //     throw new NotFoundException('User Not found');
  //   } else {
  //     return user;
  //   }
  // }

  // @ApiTags('Useless')
  // @Get()
  // findAllUser(@Query('email') email: string) {
  //   return this.userService.find(email);
  // }

  // @ApiTags('Useless')
  // @Patch('/:id')
  // updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
  //   return this.userService.update(parseInt(id), body);
  // }

  // @ApiTags('Useless')
  // @Delete('/:id')
  // deleteUser(@Param('id') id: string) {
  //   return this.userService.remove(parseInt(id));
  // }
}
