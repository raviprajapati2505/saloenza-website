import { NextRequest, NextResponse } from 'next/server';
import { isValidDateString } from '@/lib/booking-availability';
import { sendDemoRequestEmail } from '@/lib/demo-notify';

export const dynamic = 'force-dynamic';

function readField(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
    }

    const date = readField(body.date, 10);
    const time = readField(body.time, 80);
    const fullName = readField(body.fullName, 120);
    const businessName = readField(body.businessName, 160);
    const email = readField(body.email, 160).toLowerCase();
    const phone = readField(body.phone, 40);
    const locations = readField(body.locations, 80) || '1 Location';
    const notes = readField(body.notes, 2000);

    if (!date || !isValidDateString(date)) {
      return NextResponse.json(
        { error: 'Please select a valid date.' },
        { status: 400 }
      );
    }
    if (!time) {
      return NextResponse.json(
        { error: 'Please select a demo time.' },
        { status: 400 }
      );
    }
    if (fullName.length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid full name.' },
        { status: 400 }
      );
    }
    if (businessName.length < 2) {
      return NextResponse.json(
        { error: 'Please enter your salon or studio name.' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid work email address.' },
        { status: 400 }
      );
    }
    if (phone.length < 8) {
      return NextResponse.json(
        { error: 'Please provide a valid contact number.' },
        { status: 400 }
      );
    }

    try {
      await sendDemoRequestEmail({
        date,
        time,
        fullName,
        businessName,
        email,
        phone,
        locations,
        notes,
      });
    } catch (err) {
      console.error(
        '[DemoNotify] Failed to send demo request:',
        err instanceof Error ? err.message : 'Unknown error'
      );
      return NextResponse.json(
        { error: 'Unable to send your demo request. Please try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking: {
          id: '',
          leadId: '',
          date,
          time,
          timezone: 'Asia/Kolkata',
          googleMeetUrl: '',
          bookingReference: '',
          customerEmailSent: false,
        },
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'An unexpected server error occurred while sending your demo request.' },
      { status: 500 }
    );
  }
}
