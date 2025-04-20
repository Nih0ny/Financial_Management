import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findAllInArray() {
    const categories = await this.findAll();
    const returnArray: string[] = categories.map((category) => {
      return category.name;
    });

    return returnArray;
  }

  async findOneByName(name: string): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ name });
  }
}
