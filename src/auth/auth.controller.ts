import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AccessTokenResponse,
  SuccessResponse,
} from '../common/dtos/response-types.dto';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterUserDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from '../common/dtos/auth.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserDto } from '../common/dtos/user.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AccessTokenResponse })
  async login(@Body() body: LoginDto): Promise<AccessTokenResponse> {
    const user: User = await this.authService.validateUser(body);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOkResponse({ type: SuccessResponse })
  register(@Body() body: RegisterUserDto): Promise<SuccessResponse> {
    return this.authService.register(body);
  }

  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDto })
  async getProfile(@Request() req): Promise<UserDto> {
    return await this.authService.getProfile(req.user);
  }

  @Post('forgot-password')
  @ApiOkResponse({ type: SuccessResponse })
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
  ): Promise<SuccessResponse> {
    return await this.authService.forgotPassword(body);
  }

  @Put('reset-password')
  @ApiOkResponse({ type: SuccessResponse })
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<SuccessResponse> {
    return await this.authService.resetPassword(body);
  }

  @Put('verify-email')
  @ApiOkResponse({ type: SuccessResponse })
  async confirmEmail(@Body() body: VerifyEmailDto): Promise<SuccessResponse> {
    return await this.authService.verifyEmail(body);
  }
}
