import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // Verify the request is authorized
    const authHeader = request.headers.get('authorization')
    const secret = process.env.REVALIDATE_SECRET
    
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { path, tag } = body

    // Revalidate by path or tag
    if (path) {
      revalidatePath(path)
      return NextResponse.json({
        success: true,
        message: `Revalidated path: ${path}`,
        timestamp: new Date().toISOString()
      })
    }

    if (tag) {
      revalidateTag(tag)
      return NextResponse.json({
        success: true,
        message: `Revalidated tag: ${tag}`,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json(
      { error: 'Missing path or tag parameter' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { 
        error: 'Revalidation failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// Also support GET for simple webhook testing
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ready',
    message: 'Revalidation webhook is ready. Use POST with { path: "/path" } or { tag: "tag-name" }',
    documentation: 'Set REVALIDATE_SECRET environment variable for authorization'
  })
}
