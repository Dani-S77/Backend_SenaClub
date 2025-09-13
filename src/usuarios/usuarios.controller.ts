import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common'
import { UsuariosService } from './usuarios.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { Usuario } from './schemas/user.schema'

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Usuario> {
    console.log('Datos recibidos en el backend:', createUserDto)
    return this.usuariosService.create(createUserDto)
  }

  @Get()
  async findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.findById(id)
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<Usuario> {
    return this.usuariosService.login(loginUserDto)
  }

  // PATCH para editar el campo about
  @Patch(':id/about')
  async updateAbout(
    @Param('id') id: string,
    @Body('about') about: string,
  ): Promise<{ about: string }> {
    const updated = await this.usuariosService.updateAbout(id, about)
    return { about: updated.about }
  }

  // PATCH para unirse a un club
  @Patch(':userId/clubs/:clubId')
  async addClub(
    @Param('userId') userId: string,
    @Param('clubId') clubId: string,
  ) {
    return this.usuariosService.addClubToUser(userId, clubId)
  }

  // DELETE para salir de un club
  @Delete(':userId/clubs/:clubId')
  async removeClub(
    @Param('userId') userId: string,
    @Param('clubId') clubId: string,
  ) {
    return this.usuariosService.removeClubFromUser(userId, clubId)
  }
}
