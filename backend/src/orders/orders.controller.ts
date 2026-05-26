import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from '../common/dto/order.dto';
import { AdminGuard } from '../common/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(AdminGuard)
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('confirmed-count')
  async getConfirmedCount() {
    return this.ordersService.findConfirmedCount();
  }

  @Post()
  async create(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  async updateStatus(@Param('id') id: string, @Body() body: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(parseInt(id), body.status);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async remove(@Param('id') id: string) {
    return this.ordersService.remove(parseInt(id));
  }
}
