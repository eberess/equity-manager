import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { SeedService } from './seed';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './user.schema';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly seedService: SeedService,
  ) {}

  // Auth endpoints
  @Post('auth/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  // Seed endpoints
  @Get('seed/init')
  @ApiOperation({ summary: 'Initialize test users (Admin, Editor, Viewer)' })
  @ApiResponse({ status: 200, description: 'Test users created' })
  async seedInit() {
    await this.seedService.seedUsers();
    return { message: 'Test users seeded. Use admin@adeo.com / admin123' };
  }

  @Get('seed')
  @ApiOperation({ summary: 'Seed initial shareholder data' })
  @ApiResponse({ status: 200, description: 'Initial user created' })
  async seed() {
    return this.usersService.createInitialUser();
  }

  // Protected endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new shareholder (Admin/Editor only)' })
  @ApiResponse({ status: 201, description: 'Shareholder created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.usersService.create(createUserDto, req.user);
  }

  @Get('test-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Test JWT authentication' })
  async testAuth(@Request() req) {
    return { message: 'JWT works!', user: req.user };
  }

  @Get('export/csv')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Export shareholders to CSV' })
  @ApiResponse({ status: 200, description: 'CSV file downloaded' })
  async exportToCsv(@Res() res: Response) {
    const users = await this.usersService.findAll();
    
    // Generate CSV header
    const headers = ['First Name', 'Last Name', 'Email', 'Business Unit', 'Share Count', 'Role', 'Created At'];
    const csvHeader = headers.join(',') + '\n';
    
    // Generate CSV rows
    const csvRows = users.map(user => {
      const userDoc = user as any;
      return [
        user.firstName,
        user.lastName,
        user.email,
        user.businessUnit,
        user.shareCount,
        user.role || 'viewer',
        userDoc.createdAt ? new Date(userDoc.createdAt).toISOString() : '',
      ].join(',');
    }).join('\n');
    
    const csv = csvHeader + csvRows;
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=shareholders-${Date.now()}.csv`);
    res.send(csv);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all shareholders' })
  @ApiResponse({ status: 200, description: 'List of shareholders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get shareholder by ID' })
  @ApiResponse({ status: 200, description: 'Shareholder found' })
  @ApiResponse({ status: 404, description: 'Shareholder not found' })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update shareholder (Admin/Editor only)' })
  @ApiResponse({ status: 200, description: 'Shareholder updated' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete shareholder (Admin only)' })
  @ApiResponse({ status: 200, description: 'Shareholder deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.usersService.delete(id, req.user);
  }
}
