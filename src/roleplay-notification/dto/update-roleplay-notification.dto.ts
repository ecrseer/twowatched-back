import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleplayNotificationDto } from './create-roleplay-notification.dto';

export class UpdateRoleplayNotificationDto extends PartialType(CreateRoleplayNotificationDto) {}
