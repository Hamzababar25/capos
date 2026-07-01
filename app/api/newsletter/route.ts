import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createElement } from 'react';
import NewsletterWelcome from '@/emails/NewsletterWelcome';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM ?? 'CAPOS Coffee <onboarding@resend.dev>';
const TO   = process.env.RESEND_TO   ?? 'hello@capos.coffee';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // 1. Welcome email to subscriber
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: 'Welcome to CAPOS — Stories from Origin',
      react:   createElement(NewsletterWelcome, { email }),
    });

    // 2. Internal notification (so you know someone signed up)
    await resend.emails.send({
      from:    FROM,
      to:      TO,
      subject: `New newsletter subscriber: ${email}`,
      react:   createElement(NewsletterWelcome, { email }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[/api/newsletter]', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
