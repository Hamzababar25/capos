import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createElement } from 'react';
import CateringInquiry     from '@/emails/CateringInquiry';
import CateringConfirmation from '@/emails/CateringConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM  ?? 'CAPOS Coffee <onboarding@resend.dev>';
const TO   = process.env.RESEND_TO    ?? 'hello@capos.coffee';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, eventType, eventDate, venue, guests, notes } = body;

    // Basic server-side validation
    if (!name || !email || !phone || !eventType || !eventDate || !venue || !guests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Notify CAPOS team
    await resend.emails.send({
      from:     FROM,
      to:       TO,
      replyTo:  email,
      subject:  `New Catering Inquiry: ${eventType} · ${eventDate}`,
      react:    createElement(CateringInquiry, { name, email, phone, eventType, eventDate, venue, guests, notes }),
    });

    // 2. Auto-reply to customer
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: `We received your inquiry, ${name}: CAPOS Coffee`,
      react:   createElement(CateringConfirmation, { name, eventType, eventDate }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[/api/catering]', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
