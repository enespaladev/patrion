import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Company } from "./company.entity";
import { CreateCompanyDto } from "./company.dto";

@Injectable()
export class CompanyService {
  constructor(@InjectRepository(Company) private companyRepo: Repository<Company>) {}

  async createCompany(dto: CreateCompanyDto) {
    const existing = await this.companyRepo.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Bu isimde şirket zaten var');
    const company = this.companyRepo.create(dto);
    return this.companyRepo.save(company);
  }

  async findAll() {
    return this.companyRepo.find();
  }
}
