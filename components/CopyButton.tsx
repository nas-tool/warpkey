"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  label?: string
}

export function CopyButton({
  value,
  className,
  label = "Copy",
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => {
        setHasCopied(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [hasCopied])

  const handleCopy = () => {
    let textToCopy = value
    if (typeof window !== 'undefined' && value.startsWith('/')) {
      textToCopy = `${window.location.origin}${value}`
    }
    
    navigator.clipboard.writeText(textToCopy)
    setHasCopied(true)
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn("relative z-10 h-6 w-6 text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-50", className)}
      onClick={handleCopy}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {hasCopied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  )
}
