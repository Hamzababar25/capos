import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createElement } from 'react';
import NewsletterWelcome from '@/emails/NewsletterWelcome';
import { appendNewsletterSubscriber, isGoogleSheetsConfigured } from '@/lib/googleSheets';
import { saveNewsletterSubscriber } from '@/lib/newsletter';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM ?? 'CAPOS Coffee <onboarding@resend.dev>';
const TO = process.env.RESEND_TO ?? 'hello@capos.coffee';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // 1. Save to Supabase + Sanity Studio
    const saved = await saveNewsletterSubscriber(email);
    if (!saved.ok) {
      console.error('[/api/newsletter] save failed', saved.errors);
      // Still try emails — but report if Sanity failed hard
    }

    // 2. Welcome email to subscriber (best-effort in test mode)
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'Welcome to CAPOS: Stories from Origin',
        react: createElement(NewsletterWelcome, { email }),
      });
      if (error) console.error('[/api/newsletter] welcome failed', error);
    } catch (err) {
      console.error('[/api/newsletter] welcome threw', err);
    }

    // 3. Internal notification
    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: TO,
        subject: `New newsletter subscriber: ${email}`,
        react: createElement(NewsletterWelcome, { email }),
      });
      if (error) console.error('[/api/newsletter] notify failed', error);
    } catch (err) {
      console.error('[/api/newsletter] notify threw', err);
    }

    // 4. Optional Google Sheets
    if (isGoogleSheetsConfigured()) {
      try {
        await appendNewsletterSubscriber(email);
      } catch (sheetErr) {
        console.error('[/api/newsletter] Google Sheets append failed', sheetErr);
      }
    }

    return NextResponse.json({
      success: true,
      saved: saved.ok,
      saveErrors: saved.errors,
    });
  } catch (err) {
    console.error('[/api/newsletter]', err);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
