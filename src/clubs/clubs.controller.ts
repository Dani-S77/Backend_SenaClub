// src/clubs/clubs.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'
import { ClubsService } from './clubs.service'
import { CreateClubDto } from './dto/create-club.dto'
import { UpdateClubDto } from './dto/update-club.dto'
import { Club } from './schemas/club.schema'

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Post()
  async create(@Body() createClubDto: CreateClubDto): Promise<Club> {
    // ─── LOGUEO PARA DEPURAR ───────────────────────────────────────────────
    console.log('📥 RAW body recibido (antes de DTO):', JSON.stringify(createClubDto))
    console.log('📥 typeof name:', typeof createClubDto.name, '; contenido:', createClubDto.name)
    // ──────────────────────────────────────────────────────────────────────

    return this.clubsService.create(createClubDto)
  }

  @Get()
  async findAll(): Promise<Club[]> {
    return this.clubsService.findAll()
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClubDto: UpdateClubDto,
  ): Promise<Club> {
    return this.clubsService.update(id, updateClubDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Club> {
    return this.clubsService.remove(id)
  }
}
