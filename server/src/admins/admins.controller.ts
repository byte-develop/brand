import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Admins } from './entities/admins.entity';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  async getAllAdmins(): Promise<Admins[]> { 
    return this.adminsService.findAll();
  }
}