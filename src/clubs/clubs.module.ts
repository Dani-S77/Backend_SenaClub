import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClubsController } from './clubs.controller';
import { ClubsService } from './clubs.service';
import { Club, ClubSchema } from './schemas/club.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Club.name, schema: ClubSchema }])],
  controllers: [ClubsController],
  providers: [ClubsService],
})
export class ClubsModule {}