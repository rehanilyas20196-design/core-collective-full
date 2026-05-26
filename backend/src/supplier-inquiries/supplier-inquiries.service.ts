import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SupplierInquiriesService {
  constructor(private supabase: SupabaseService) {}

  async create(data: {
    item_name: string;
    details: string;
    quantity: number;
    unit?: string;
  }) {
    const payload = {
      item_name: data.item_name,
      details: data.details,
      quantity: data.quantity,
      unit: data.unit || 'Pcs',
      status: 'pending',
    };

    const { data: result, error } = await this.supabase
      .from('supplier_inquiries')
      .insert([payload])
      .select();
    if (error) throw error;
    return result;
  }
}
