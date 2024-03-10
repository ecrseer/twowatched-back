import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleplayNotificationService } from './roleplay-notification.service';
import { CreateRoleplayNotificationDto } from './dto/create-roleplay-notification.dto';
import { UpdateRoleplayNotificationDto } from './dto/update-roleplay-notification.dto';

@Controller('roleplay-notification')
export class RoleplayNotificationController {
  constructor(
    private readonly roleplayNotificationService: RoleplayNotificationService,
  ) {}

  // @Post()
  // create(@Body() createRoleplayNotificationDto: CreateRoleplayNotificationDto) {
  //   return this.roleplayNotificationService.create(
  //     createRoleplayNotificationDto,
  //   );
  // }

  // @Get()
  // findAll() {
  //   return this.roleplayNotificationService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.roleplayNotificationService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() user_id: string) {
  //   return this.roleplayNotificationService.join_acceptance_roleplay_notification(
  //     id,
  //     user_id,
  //   );
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roleplayNotificationService.remove(+id);
  // }
}
