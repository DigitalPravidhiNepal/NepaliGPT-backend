import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { roleType } from 'src/helper/types/index.type';
import { authEntity } from 'src/model/auth.entity';
import { PricingEntity } from 'src/model/pricing.entity';
import { superAdminEntity } from 'src/model/superAdmin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SuperAdminSeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(superAdminEntity)
    private readonly superAdminRepository: Repository<superAdminEntity>,

    @InjectRepository(authEntity)
    private readonly authRepository: Repository<authEntity>,

    @InjectRepository(PricingEntity)
    private readonly pricingRepository: Repository<PricingEntity>,
  ) {}

  async onApplicationBootstrap() {
    // ✅ Seed Super Admin
    const existingSuperAdmin = await this.authRepository.findOne({
      where: {
        email: 'admin@gmail.com',
        role: roleType.superAdmin,
      },
    });

    if (!existingSuperAdmin) {
      const auth = new authEntity();
      auth.email = 'admin@gmail.com';
      auth.password =
        '$argon2id$v=19$m=65536,t=3,p=4$+kTdKqlMc+olAIhpurEs7g$PzgSaoQob8g6B38S7VOahZ89OEHEfm6ohIr8R5V3gso'; // Pre-hashed password
      auth.role = roleType.superAdmin;
      const savedAuth = await this.authRepository.save(auth);

      const superAdmin = new superAdminEntity();
      superAdmin.auth = savedAuth;
      superAdmin.name = 'Admin';
      superAdmin.photo = 'https://avatars.githubusercontent.com/u/104062761?v=4';
      await this.superAdminRepository.save(superAdmin);

      console.log('✅ Seeded admin user');
    }

    // ✅ Seed Pricing
    const existingPricingSchema = await this.pricingRepository.find();
    if (existingPricingSchema.length === 0) {
      const pricing = new PricingEntity();
      pricing.exchangeRate = '139.50';
      pricing.totalTokenCost = '0.15';
      await this.pricingRepository.save(pricing);

      console.log('✅ Seeded pricing schema');
    }
  }
}