import airportsData from '../data/airports.json'
import { NextResponse } from 'next/server';

export async function GET() {
    await new Promise((res) => setTimeout(res, 500));
    return NextResponse.json(airportsData);
}
