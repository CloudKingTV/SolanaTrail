'use client'

interface GuideMessageProps {
  message: string
}

export function GuideMessage({ message }: GuideMessageProps) {
  return (
    <div className="mx-4 my-2 p-3 rounded-lg border border-sol-blue/30 bg-sol-blue/5 relative">
      <div className="flex items-start gap-2">
        <span className="text-lg flex-shrink-0">💡</span>
        <div>
          <div className="text-[10px] font-semibold text-sol-blue mb-1">GUIDE</div>
          <p className="text-xs text-sol-text/80 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  )
}
