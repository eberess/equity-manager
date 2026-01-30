import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = new this.userModel(createUserDto);
      return await newUser.save();
    } catch (error) {
      console.error('Erreur MongoDB :', error.message);
      throw error;
    }
  }

  async createInitialUser() {
    try {
      const newUser = new this.userModel({
        firstName: 'A',
        lastName: 'B',
        email: 'abe@ab.com',
        businessUnit: 'Equity Services',
        shareCount: 100,
      });
      return await newUser.save();
    } catch (error) {
      console.error('Erreur MongoDB :', error.message);
      throw error;
    }
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findById(id: string) {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      console.error('Erreur lors de la recherche:', error.message);
      throw error;
    }
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>) {
    try {
      return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error.message);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await this.userModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error.message);
      throw error;
    }
  }
}
