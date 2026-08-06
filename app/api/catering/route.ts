import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createElement } from 'react';
import CateringInquiry from '@/emails/CateringInquiry';
import CateringConfirmation from '@/emails/CateringConfirmation';
import { saveEventInquiry } from '@/lib/inquiries';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM ?? 'CAPOS Coffee <onboarding@resend.dev>';
const TO = process.env.RESEND_TO ?? 'hello@capos.coffee';

async function sendEmail(
  label: string,
  payload: Parameters<typeof resend.emails.send>[0]
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data, error } = await resend.emails.send(payload);
    if (error) {
      console.error(`[/api/catering] ${label} failed:`, error);
      return { ok: false, error: error.message };
    }
    console.info(`[/api/catering] ${label} sent`, data?.id);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'email send failed';
    console.error(`[/api/catering] ${label} threw:`, err);
    return { ok: false, error: message };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, eventType, eventDate, venue, guests, budget, notes } =
      body;

    if (!name || !email || !phone || !eventType || !eventDate || !venue || !guests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inquiry = {
      name,
      email,
      phone,
      eventType,
      eventDate,
      venue,
      guests,
      budget: typeof budget === 'string' ? budget : '',
      notes: typeof notes === 'string' ? notes : '',
    };

    // 1. Store in Supabase + Sanity Studio (New)
    const saved = await saveEventInquiry(inquiry);
    if (!saved.ok) {
      console.error('[/api/catering] save failed', saved.errors);
      return NextResponse.json(
        { error: 'Failed to save inquiry', details: saved.errors },
        { status: 500 }
      );
    }

    // 2. Notify CAPOS team
    const teamMail = await sendEmail('team notify', {
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `New Catering Inquiry: ${eventType} · ${eventDate}`,
      react: createElement(CateringInquiry, {
        name,
        email,
        phone,
        eventType,
        eventDate,
        venue,
        guests,
        budget,
        notes,
      }),
    });

    // 3. Auto-reply to customer
    const confirmMail = await sendEmail('customer confirm', {
      from: FROM,
      to: email,
      subject: `We received your inquiry, ${name}: CAPOS Coffee`,
      react: createElement(CateringConfirmation, { name, eventType, eventDate }),
    });

    return NextResponse.json({
      success: true,
      id: saved.sanityId || saved.supabaseId,
      email: {
        team: teamMail.ok,
        confirmation: confirmMail.ok,
        teamError: teamMail.error,
        confirmationError: confirmMail.error,
      },
    });
  } catch (err) {
    console.error('[/api/catering]', err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
