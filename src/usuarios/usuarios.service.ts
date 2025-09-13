import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Usuario, UsuarioDocument } from './schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    const createdUser = new this.usuarioModel(createUserDto)
    return createdUser.save()
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec()
  }

  async findById(id: string): Promise<Usuario> {
    const user = await this.usuarioModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`)
    }
    return user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Usuario> {
    const updatedUser = await this.usuarioModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    )
    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`)
    }
    return updatedUser
  }

  async updateAbout(id: string, about: string): Promise<Usuario> {
    const updatedUser = await this.usuarioModel.findByIdAndUpdate(
      id,
      { about },
      { new: true },
    )
    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`)
    }
    return updatedUser
  }

  async remove(id: string): Promise<Usuario> {
    const deletedUser = await this.usuarioModel.findByIdAndDelete(id)
    if (!deletedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`)
    }
    return deletedUser
  }

  async login(loginUserDto: LoginUserDto): Promise<Usuario> {
    const { email, password } = loginUserDto
    const user = await this.usuarioModel.findOne({ email }).exec()
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`)
    }
    if (user.password !== password) {
      throw new NotFoundException(`Credenciales inválidas`)
    }
    return user
  }

  // NUEVOS MÉTODOS para clubs
  async addClubToUser(userId: string, clubId: string) {
    const updated = await this.usuarioModel.findByIdAndUpdate(
      userId,
      { $addToSet: { clubs: clubId } },
      { new: true },
    )
    if (!updated) {
      throw new NotFoundException(`Usuario ${userId} no encontrado`)
    }
    return { message: 'Club agregado', clubs: updated.clubs }
  }

  async removeClubFromUser(userId: string, clubId: string) {
    const updated = await this.usuarioModel.findByIdAndUpdate(
      userId,
      { $pull: { clubs: clubId } },
      { new: true },
    )
    if (!updated) {
      throw new NotFoundException(`Usuario ${userId} no encontrado`)
    }
    return { message: 'Club removido', clubs: updated.clubs }
  }
}
