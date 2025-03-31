import { PartialType } from '@nestjs/mapped-types';
import { CreateWorksDto } from './create-works.dto';

export class UpdateWorksDto extends PartialType(CreateWorksDto) {}
