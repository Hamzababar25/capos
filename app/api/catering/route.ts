import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createElement } from 'react';
import CateringInquiry from '@/emails/CateringInquiry';
import CateringConfirmation from '@/emails/CateringConfirmation';
import { saveEventInquiry } from '@/lib/inquiries';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM ?? 'CAPOS Coffee <onboarding@resend.dev>';
const TO = process.env.RESEND_TO ?? 'hello@capos.coffee';

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

    // 2. Notify CAPOS team (Outlook / inbox)
    try {
      await resend.emails.send({
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
    } catch (emailErr) {
      console.error('[/api/catering] team email failed', emailErr);
    }

    // 3. Auto-reply to customer
    try {
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: `We received your inquiry, ${name}: CAPOS Coffee`,
        react: createElement(CateringConfirmation, { name, eventType, eventDate }),
      });
    } catch (emailErr) {
      console.error('[/api/catering] confirmation email failed', emailErr);
    }

    return NextResponse.json({
      success: true,
      id: saved.sanityId || saved.supabaseId,
    });
  } catch (err) {
    console.error('[/api/catering]', err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
