import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './Schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(content: string, userId: string): Promise<Post> {
    const post = new this.postModel({ content, user: userId });
    return post.save();
  }

  async findByUser(userId: string): Promise<Post[]> {
    return this.postModel.find({ user: userId }).exec();
  }
}