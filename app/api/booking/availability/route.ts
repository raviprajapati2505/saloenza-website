import { NextRequest, NextResponse } from 'next/server';
import {
  BOOKING_TIMEZONE,
  calculateAvailabilitySlots,
  isValidDateString,
} from '@/lib/booking-availability';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const date = new URL(request.url).searchParams.get('date');

    if (!date || !isValidDateString(date)) {
      return NextResponse.json(
        {
          error:
            'Invalid or missing date parameter. Please provide a valid calendar date in YYYY-MM-DD format.',
        },
        { status: 400 }
      );
    }

    const slots = calculateAvailabilitySlots(date, []);

    return NextResponse.json(
      {
        date,
        timezone: BOOKING_TIMEZONE,
        slots,
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      }
    );
  } catch {
    return NextResponse.json(
      { error: 'An unexpected error occurred while calculating availability.' },
      { status: 500 }
    );
  }
}
