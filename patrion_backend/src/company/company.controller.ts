import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/user/user.entity";
import { CreateCompanyDto } from "./company.dto";

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SYSTEM_ADMIN)
  @Post("create")
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.createCompany(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SYSTEM_ADMIN)
  @Get()
  getAll() {
    return this.companyService.findAll();
  }
}
