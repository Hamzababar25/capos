import { getSanityWriteClient } from './sanity';
import { createServiceClient } from './supabase';

export interface EventInquiryInput {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  venue: string;
  guests: string;
  budget?: string;
  notes?: string;
}

export interface SaveInquiryResult {
  ok: boolean;
  sanityId?: string;
  supabaseId?: string;
  errors: string[];
}

/**
 * Store catering inquiry in Supabase + Sanity Studio.
 * Email is handled separately by the API route.
 */
export async function saveEventInquiry(
  input: EventInquiryInput
): Promise<SaveInquiryResult> {
  const errors: string[] = [];
  let supabaseId: string | undefined;
  let sanityId: string | undefined;
  const submittedAt = new Date().toISOString();

  // 1. Supabase (durable DB)
  const supabase = createServiceClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('event_inquiries')
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone,
        event_type: input.eventType,
        event_date: input.eventDate,
        venue: input.venue,
        guests: input.guests,
        budget: input.budget || null,
        notes: input.notes || null,
        status: 'new',
        submitted_at: submittedAt,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[inquiries] supabase insert failed', error);
      errors.push(`supabase: ${error.message}`);
    } else {
      supabaseId = data?.id;
    }
  } else {
    errors.push('supabase: not configured');
  }

  // 2. Sanity (Studio view — New / Responded)
  const sanity = getSanityWriteClient();
  if (sanity) {
    try {
      const doc = await sanity.create({
        _type: 'eventInquiry',
        status: 'new',
        name: input.name,
        email: input.email,
        phone: input.phone,
        eventType: input.eventType,
        eventDate: input.eventDate,
        venue: input.venue,
        guests: input.guests,
        budget: input.budget || '',
        notes: input.notes || '',
        submittedAt,
        supabaseId: supabaseId || '',
      });
      sanityId = doc._id;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'sanity create failed';
      console.error('[inquiries] sanity create failed', err);
      errors.push(`sanity: ${msg}`);
    }
  } else {
    errors.push('sanity: write client not configured');
  }

  return {
    ok: Boolean(sanityId || supabaseId),
    sanityId,
    supabaseId,
    errors,
  };
}
