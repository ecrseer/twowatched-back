import { PartialType } from '@nestjs/mapped-types';
import { CreateTwaroomDto } from './create-twaroom.dto';

export class UpdateTwaroomDto extends PartialType(CreateTwaroomDto) {}
