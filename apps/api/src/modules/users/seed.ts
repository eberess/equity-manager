import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.schema';

@Injectable()
export class SeedService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async seedUsers() {
    // Check if admin exists
    const adminExists = await this.userModel.findOne({ email: 'admin@adeo.com' });
    if (adminExists) {
      console.log('Seed users already exist');
      return;
    }

    const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
    const hashedPasswordEditor = await bcrypt.hash('editor123', 10);
    const hashedPasswordViewer = await bcrypt.hash('viewer123', 10);

    const seedData = [
      {
        firstName: 'Admin',
        lastName: 'ADEO',
        email: 'admin@adeo.com',
        password: hashedPasswordAdmin,
        businessUnit: 'Management',
        shareCount: 1000,
        role: UserRole.ADMIN,
      },
      {
        firstName: 'Editor',
        lastName: 'ADEO',
        email: 'editor@adeo.com',
        password: hashedPasswordEditor,
        businessUnit: 'Operations',
        shareCount: 500,
        role: UserRole.EDITOR,
      },
      {
        firstName: 'Viewer',
        lastName: 'ADEO',
        email: 'viewer@adeo.com',
        password: hashedPasswordViewer,
        businessUnit: 'Sales',
        shareCount: 100,
        role: UserRole.VIEWER,
      },
    ];

    await this.userModel.insertMany(seedData);
    console.log('✅ Seed users created successfully');
  }
}
