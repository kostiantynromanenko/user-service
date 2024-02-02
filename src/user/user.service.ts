import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    const user = new User();
    user.externalId = createUserDto.externalId;
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = new User();
    user.externalId = updateUserDto.externalId;
    return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  async remove(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
