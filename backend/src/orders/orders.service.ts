import { Injectable, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class OrdersService {
  constructor(private supabase: SupabaseService) {}

  async findAll(userId?: string, userEmail?: string) {
    const isAdmin = userEmail === 'rehanilyas20196@gmail.com';

    let query = this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!isAdmin && userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw new InternalServerErrorException(error.message);
    return data || [];
  }

  async findConfirmedCount(userId?: string, userEmail?: string) {
    const isAdmin = userEmail === 'rehanilyas20196@gmail.com';

    let query = this.supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed');

    if (!isAdmin && userId) {
      query = query.eq('user_id', userId);
    }

    const { count, error } = await query;
    if (error) throw new InternalServerErrorException(error.message);
    return count || 0;
  }

  async create(orderData: any, userId?: string, userEmail?: string) {
    const payload = {
      user_id: userId || null,
      user_email: userEmail || '',
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
    if (error) throw new InternalServerErrorException(error.message);

    if (data && data.length > 0 && userId) {
      const order = data[0];
      await this.supabase.from('notifications').insert([{
        user_id: userId,
        type: 'pending',
        title: 'Order Placed',
        message: `Your order #ORD-${String(order.id).padStart(6, '0')} has been placed and is pending review. We will notify you once it is confirmed.`,
        data: { order_id: order.id },
      }]);
    }

    return data;
  }

  async updateStatus(orderId: number, status: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();
    if (error) throw new InternalServerErrorException(error.message);

    if (data && data.length > 0 && data[0].user_id && (status === 'confirmed' || status === 'rejected')) {
      const order = data[0];
      const notifType = status === 'confirmed' ? 'success' : 'error';
      const notifTitle = status === 'confirmed' ? 'Order Confirmed' : 'Order Rejected';
      const notifMessage = status === 'confirmed'
        ? `Your order #ORD-${String(order.id).padStart(6, '0')} has been confirmed! Thank you for your purchase.`
        : `Your order #ORD-${String(order.id).padStart(6, '0')} has been rejected. Please contact support for more details.`;

      await this.supabase.from('notifications').insert([{
        user_id: order.user_id,
        type: notifType,
        title: notifTitle,
        message: notifMessage,
        data: { order_id: order.id },
      }]);
    }

    return data;
  }

  async remove(orderId: number) {
    const { error } = await this.supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
    if (error) throw new InternalServerErrorException(error.message);
    return { deleted: true };
  }
}
