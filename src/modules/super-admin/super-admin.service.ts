import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { UpdateSuperAdminDto } from './dto/update-super-admin.dto';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { DataSource, Repository } from 'typeorm';
import { authEntity } from 'src/model/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantStatus, roleType } from 'src/helper/types/index.type';
import { hash } from 'src/helper/utils/hash';
import { packageEntity } from 'src/model/package.entity';
import { UUID } from 'crypto';
import { superAdminEntity } from 'src/model/superAdmin.entity';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(authEntity)
    private readonly authRepository: Repository<authEntity>,

    @InjectRepository(packageEntity)
    private readonly packageRepository: Repository<packageEntity>,

    // @InjectRepository(superAdminEntity)
    // private readonly superAdminRepo: Repository<superAdminEntity>,
    private hash: hash,
    private dataSource: DataSource
  ) { }

  async createSuperAdmin(createSuperAdmin: CreateSuperAdminDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { email, password, name } = createSuperAdmin;
      const hashedPassword = await this.hash.value(password);
      const auth = new authEntity();
      auth.email = email;
      (auth.password = hashedPassword), (auth.role = roleType.superAdmin);
      await queryRunner.manager.save(auth);

      const admin = new superAdminEntity();
      admin.name = name;
      admin.photo = 'https://img.freepik.com/free-photo/young-woman-working-laptop-isolated-white-background_231208-1838.jpg?t=st=1738736255~exp=1738739855~hmac=a3d7e9b01ac341e40793841139b99a7f72f742376109d5a036ad0fcfef6782cc&w=996';
      admin.auth = auth;
      await queryRunner.manager.save(admin);
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

  // async deleteSuperAdmin(id: UUID): Promise<authEntity> {
  //   const existingAdminAll = await this.authRepository.find();
  //   if (existingAdminAll.length === 1) {
  //     throw new ForbiddenException('Super Admin can not delete');
  //   }
  //   const existingAdmin = await this.authRepository.findOne({ where: { id } });
  //   return await this.authRepository.remove(existingAdmin);
  // }

  // async createRestaurant(data: CreateRestaurant) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     const { email, password, name, address, zip_code, phone } = data;
  //     const hashedPassword = await this.hash.value(password);
  //     const auth = new authEntity();
  //     auth.email = email;
  //     (auth.password = hashedPassword), (auth.role = roleType.admin);
  //     await queryRunner.manager.save(auth);

  //     const restaurant = new restaurantEntity();
  //     restaurant.name = name;
  //     restaurant.address = address;
  //     restaurant.zip_code = zip_code;
  //     restaurant.auth = auth;
  //     restaurant.phone = phone;
  //     await queryRunner.manager.save(restaurant);

  //     await queryRunner.commitTransaction();
  //     return true;
  //   } catch (error) {
  //     console.log(error);
  //     await queryRunner.rollbackTransaction();
  //     throw new ForbiddenException(error.errorResponse);
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }
  // async updateRestaurantStatus(data: updateRestaurant) {
  //   const exisingRestaurant = await this.restaurantRepository.findOne({
  //     where: { id: data.id },
  //   });
  //   exisingRestaurant.status = data.isDisabled ? RestaurantStatus.inactive : RestaurantStatus.active;
  //   await this.restaurantRepository.save(exisingRestaurant);
  // }

  // async deleteRestaurant(id: UUID): Promise<restaurantEntity> {
  //   const existingRestaurant = await this.restaurantRepository.findOne({ where: { id } });
  //   return await this.restaurantRepository.remove(existingRestaurant);
  // }

  // async findAllRestaurant() {
  //   return await this.restaurantRepository.find({
  //     relations: ['auth'],
  //     select: {
  //       auth: {
  //         email: true,
  //       },
  //     },
  //   });
  // }

  // async createPackage(createPackageDto: CreatePackageDto): Promise<packageEntity> {
  //   const newPackage = this.packageRepository.create(createPackageDto);
  //   return await this.packageRepository.save(newPackage);
  // }

  // async findAllPackageById(id: UUID): Promise<packageEntity> {
  //   return await this.packageRepository.findOne({ where: { id: id } });
  // }

  // async findAllPackage(): Promise<packageEntity[]> {
  //   return await this.packageRepository.find();
  // }

  // async updatePackage(id: string, updatePackageDto: CreatePackageDto): Promise<packageEntity> {
  //   const existingPackage = await this.packageRepository.findOne({ where: { id } });
  //   const updatedPackage = Object.assign(existingPackage, updatePackageDto);
  //   return await this.packageRepository.save(updatedPackage);
  // }

  // async deletePackage(id: UUID): Promise<packageEntity> {
  //   const existingPackage = await this.packageRepository.findOne({ where: { id } });
  //   return await this.packageRepository.remove(existingPackage);
  // }

}
