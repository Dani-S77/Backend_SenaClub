import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Usuario } from './schemas/user.schema';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  
  @Post()
async create(@Body() createUserDto: CreateUserDto): Promise<Usuario> {
  console.log('Datos recibidos en el backend:', createUserDto); // Verifica los datos recibidos
  return this.usuariosService.create(createUserDto);
}

  
  @Get()
  async findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Usuario> {
    return this.usuariosService.findById(id);
  }

  
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<Usuario> {
    return this.usuariosService.login(loginUserDto);
  }
}