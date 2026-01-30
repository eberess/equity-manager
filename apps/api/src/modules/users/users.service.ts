import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../audit/audit.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => AuditService)) private auditService: AuditService,
  ) {}

  async create(createUserDto: CreateUserDto, currentUser?: any) {
    try {
      const newUser = new this.userModel(createUserDto);
      const savedUser = await newUser.save();
      
      // Log audit
      if (currentUser) {
        await this.auditService.log({
          userId: currentUser.userId,
          userEmail: currentUser.email,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          action: AuditAction.CREATE,
          entityType: 'User',
          entityId: savedUser._id.toString(),
          newValues: createUserDto,
        });
      }
      
      return savedUser;
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

  async update(id: string, updateUserDto: Partial<CreateUserDto>, currentUser?: any) {
    try {
      // Get old values before update
      const oldUser = await this.userModel.findById(id).exec();
      const oldValues = oldUser ? oldUser.toObject() : null;
      
      const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
      
      // Log audit
      if (currentUser && oldValues) {
        await this.auditService.log({
          userId: currentUser.userId,
          userEmail: currentUser.email,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          action: AuditAction.UPDATE,
          entityType: 'User',
          entityId: id,
          oldValues,
          newValues: updateUserDto,
        });
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error.message);
      throw error;
    }
  }

  async delete(id: string, currentUser?: any) {
    try {
      // Get user before delete
      const userToDelete = await this.userModel.findById(id).exec();
      const oldValues = userToDelete ? userToDelete.toObject() : null;
      
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      
      // Log audit
      if (currentUser && oldValues) {
        await this.auditService.log({
          userId: currentUser.userId,
          userEmail: currentUser.email,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          action: AuditAction.DELETE,
          entityType: 'User',
          entityId: id,
          oldValues,
        });
      }
      
      return deletedUser;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error.message);
      throw error;
    }
  }
}
