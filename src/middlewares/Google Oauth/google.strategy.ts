import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { VerifyCallback } from "jsonwebtoken";
import { Strategy } from "passport-google-oauth2";
import { roleType } from "src/helper/types/index.type";
import { authEntity } from "src/model/auth.entity";
import { userEntity } from "src/model/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(@InjectRepository(authEntity) private authRepo: Repository<authEntity>,
        @InjectRepository(userEntity) private userRepo: Repository<userEntity>) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
        const { emails, id, displayName, photos } = profile;
        const email = emails[0].value;

        // Check if user exists by email
        let auth = await this.authRepo.findOne({
            where: { email },
            relations: ['user'],
        });

        if (auth) {
            // If the user exists but has no Google ID, update it
            if (!auth.googleId) {
                auth.googleId = id;
                await this.authRepo.save(auth);
            }

            return done(null, auth);
        }

        // If the user doesn't exist, create a new one
        auth = this.authRepo.create({
            email,
            googleId: id,
            role: roleType.customer
        });
        await this.authRepo.save(auth);
        const newUser = this.userRepo.create({
            name: displayName,
            photo: photos[0]?.value || null,
            auth: auth
        });
        await this.userRepo.save(newUser);


        return done(null, auth);
    }

}
