import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class OrdersService {
  constructor(private supabase: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findConfirmedCount() {
    const { count, error } = await this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed');
    if (error) throw error;
    return count || 0;
  }

  async create(orderData: any) {
    const payload = {
      full_name: orderData.full_name,
      phone_number: orderData.phone_number,
      province: orderData.province,
      city: orderData.city,
      area: orderData.area,
      building_street: orderData.building_street,
      colony_suburb: orderData.colony_suburb,
      address: orderData.address,
      label: orderData.label || 'HOME',
      total_amount: orderData.total_amount,
      payment_method: orderData.payment_method,
      payment_screenshot: orderData.payment_screenshot || '',
      items: orderData.items || [],
      status: 'pending',
    };

    const { data, error } = await this.supabase
      .from('orders')
      .insert([payload])
      .select();
    if (error) throw error;
    return data;
  }

  async updateStatus(orderId: number, status: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();
    if (error) throw error;
    return data;
  }

  async remove(orderId: number) {
    const { error } = await this.supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    if (error) throw error;
    return { deleted: true };
  }
}
