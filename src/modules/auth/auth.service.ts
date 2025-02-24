import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto, MailDto, passwordDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Token } from 'src/helper/utils/token';
import { hash } from 'src/helper/utils/hash';
import { authEntity } from 'src/model/auth.entity';
import { JwtPayload, roleType, VerifyPayload } from 'src/helper/types/index.type';
import { sendMail } from 'src/config/mail.config';
import { userEntity } from 'src/model/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(authEntity)
    private readonly authRepository: Repository<authEntity>,
    private token: Token,
    private hash: hash,
    private dataSource: DataSource
  ) { }




  async login(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const authUser = await this.authRepository.findOne({
      where: { email },
      relations: ['user', 'superAdmin']
    });
    if (!authUser) {
      throw new ForbiddenException("User Not found")
    } else {
      const status = await this.hash.verifyHashing(authUser.password, password);
      if (!status) {
        throw new UnauthorizedException("Credential doesn't match");
      }
      const userId = authUser.superAdmin ? authUser.superAdmin.id : authUser.user.id;
      const tokens = {
        accessToken: await this.token.generateAcessToken({
          sub: userId,
          role: authUser.role,
        }),
        refreshToken: await this.token.generateRefreshToken({
          sub: userId,
          role: authUser.role,
        }),
        role: authUser.role,
      };
      authUser.rToken = await this.hash.value(tokens.refreshToken);
      await this.authRepository.save(authUser);
      return tokens;
    }
  }

  //verify email
  async getVerify(mail: MailDto) {
    try {
      const { email } = mail;
      const existingUser = await this.authRepository.findOne(
        {
          where: { email }
        });


      if (existingUser) {
        throw new ForbiddenException("User already exists.");
      } else {
        const token = await this.token.generateVerifyToken({ email: email });
        console.log(token);

        const frontURL = `${process.env.FRONT_URL}/verified?${token}`;
        try {
          sendMail(email, 'Email Verification', this.emailTemplate(frontURL));
        } catch (error) {
          throw error;
        }
        return true;
      }
    } catch (e) {

      throw new BadRequestException(e.message);
    }
  }

  //register
  async create(signupDTO: CreateUserDto, jwtPayload: VerifyPayload) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const email = jwtPayload.email;
      const { password, name, phone, country } = signupDTO;
      const hashedPassword = await this.hash.value(password);
      const auth = new authEntity();
      auth.email = email;
      (auth.password = hashedPassword), (auth.role = roleType.customer);
      await queryRunner.manager.save(auth);
      const user = new userEntity();
      user.name = name;
      user.phone = phone;
      user.country = country
      user.auth = auth;
      await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(error.errorResponse);
    } finally {
      await queryRunner.release();
    }
  }

  async forgetPasswordAdmin(body: MailDto): Promise<boolean> {
    const existingUser = await this.authRepository.findOne({
      where: { email: body.email }, relations: ['user', 'superAdmin']
    });
    if (!existingUser) {
      throw new NotFoundException("Email doesn't exist.");
    }
    const token = await this.token.generateUtilToken({
      sub: existingUser.id,
      role: existingUser.role,
    });
    const frontURL = `${process.env.FRONT_URL}/reset?${token}`;
    try {
      sendMail(body.email, 'Password Reset', this.passwordTemplate(frontURL));
    } catch (error) {
      throw error;
    }
    return true;
  }



  // async getCombinedUserInfo(user: JwtPayload) {
  //   const userEntity = this.roleUser[user.role];
  //   if (userEntity === this.roleUser.admin) {
  //     const userEntity = this.roleUser[user.role];
  //     const userInfo = await this.authRepository.findOne({
  //       where: { [userEntity]: { id: user.sub } },
  //       relations: [userEntity],
  //       select: {
  //         id: true
  //       }
  //     });
  //     return { userInfo, role: 'admin' }
  //   } else if (userEntity === this.roleUser.staff) {
  //     const authUser = await this.staffRepository.findOne({
  //       where: { id: user.sub },
  //       relations: ['staffType.permission']
  //     });
  //     const permissionarray = authUser?.staffType?.permission?.map(permission => permission.name);
  //     return { permissionarray, userInfo: authUser, role: 'staff' }
  //   } else {
  //     throw new UnauthorizedException("Something unexpected error occured")
  //   }
  // }


  async refreshTokenAdmin(user: JwtPayload) {
    return await this.token.generateAcessToken({ sub: user.sub, role: user.role })
  }


  async resetPassword(id: string, passwordDto: passwordDto) {
    try {
      const { password } = passwordDto;
      const hash = await this.hash.value(password);
      const user = await this.authRepository.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException("User does'nt exist");
      }
      user.password = hash;
      return await this.authRepository.save(user);
    } catch (e) {

    }


  }

  passwordTemplate(resetUrl: any) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            width: 80%;
            padding: 12px;
            background-color: #007BFF;
            color: white;
            text-align: center;
            border-radius: 5px;
            font-size: 16px;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset Request</h1>
        <p>Hello, User</p>
        <p>You've requested to reset your password for your NepaliGPT account. Click the link below to set a new password:</p>
        <a href="${resetUrl}" class="button" style="color: white; text-decoration: none;">Reset My Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p class="footer">© 2025 NepaliGPT. All rights reserved.</p>
    </div>
</body>
</html>
  `;
  }

  emailTemplate(verifyUrl: any) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            width: 80%;
            padding: 12px;
            background-color: #007BFF;
            color: white;
            text-align: center;
            border-radius: 5px;
            font-size: 16px;
            text-decoration: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verify your email</h1>
        <p>Hello, User</p>
        <p>You've requested to verify your email for your NepaliGPT account. Click the link below to verify the email:</p>
        <a href="${verifyUrl}" class="button" style="color: white; text-decoration: none;">Verify my email </a>
        <p>If you didn't request this, please ignore this email.</p>
        <p class="footer">© 2025 NepaliGPT. All rights reserved.</p>
    </div>
</body>
</html>
  `;
  }
}
