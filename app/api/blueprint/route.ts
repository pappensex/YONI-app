import { NextResponse } from 'next/server'

import { blueprint } from '../../data/chibot-blueprint'

export async function GET() {
  return NextResponse.json(blueprint)
}
