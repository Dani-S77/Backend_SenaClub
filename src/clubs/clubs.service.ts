import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument } from './schemas/club.schema';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@Injectable()
export class ClubsService {
  constructor(@InjectModel(Club.name) private clubModel: Model<ClubDocument>) {}

  async create(createClubDto: CreateClubDto): Promise<Club> {
    const createdClub = new this.clubModel(createClubDto);
    return createdClub.save();
  }

  async findAll(): Promise<Club[]> {
    return this.clubModel.find().exec();
  }

  async update(id: string, updateClubDto: UpdateClubDto): Promise<Club> {
    const updatedClub = await this.clubModel.findByIdAndUpdate(id, updateClubDto, { new: true });
    if (!updatedClub) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }
    return updatedClub;
  }

  async remove(id: string): Promise<Club> {
    const deletedClub = await this.clubModel.findByIdAndDelete(id);
    if (!deletedClub) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }
    return deletedClub;
  }
}