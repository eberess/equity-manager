import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditAction } from './audit.schema';

@Injectable()
export class AuditService {
  constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>) {}

  async log(data: {
    userId: string;
    userEmail: string;
    userName: string;
    action: AuditAction;
    entityType: string;
    entityId?: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      const auditLog = new this.auditLogModel(data);
      await auditLog.save();
    } catch (error) {
      console.error('Error logging audit:', error);
    }
  }

  async findAll(filters?: {
    userId?: string;
    action?: AuditAction;
    entityType?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const query: any = {};

    if (filters?.userId) query.userId = filters.userId;
    if (filters?.action) query.action = filters.action;
    if (filters?.entityType) query.entityType = filters.entityType;
    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }

    return this.auditLogModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .exec();
  }

  async findByEntityId(entityId: string) {
    return this.auditLogModel
      .find({ entityId })
      .sort({ createdAt: -1 })
      .exec();
  }
}
