import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_REPOSITORY } from 'src/constant/constant';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import Sequelize from 'sequelize';

@Injectable()
export class UserService {
  constructor(@Inject(USER_REPOSITORY) private userModel: typeof User) { }

  async create(dto: CreateUserDto) {
    const saltOrRounds = 10;
    dto.password = await bcrypt.hash(dto.password, saltOrRounds);
    try {
      const user = await this.userModel.create({ ...dto } as User);
      return user;
    } catch (error) {
      if (error instanceof Sequelize.UniqueConstraintError) {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll<User>({ attributes: { exclude: ['password'] } });
  }

  async findOne(username: string) {
    const result = await this.userModel.findOne<User>({ where: { username: username } });

    return result
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userModel.update(updateUserDto, { where: { id } });
    return this.userModel.findByPk<User>(id);
  }

  async remove(id: number) {
    return this.userModel.destroy({ where: { id } });
  }
}
