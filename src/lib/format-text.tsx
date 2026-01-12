import React from 'react'

/**
 * Renders text with basic formatting support:
 * - Line breaks are preserved (via CSS white-space: pre-wrap on parent)
 * - **text** becomes bold
 * - *text* becomes italic
 */
export function renderFormattedText(content: string): React.ReactNode[] {
    if (!content) return []

    // First, handle bold (**text**)
    const boldPattern = /(\*\*[^*]+\*\*)/g
    const italicPattern = /(\*[^*]+\*)/g

    // Split by bold pattern first
    const parts = content.split(boldPattern)

    return parts.map((part, index) => {
        // Check for bold
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={`b-${index}`}>{part.slice(2, -2)}</strong>
        }

        // Check for italic within non-bold parts
        const italicParts = part.split(italicPattern)
        if (italicParts.length > 1) {
            return italicParts.map((subPart, subIndex) => {
                if (subPart.startsWith('*') && subPart.endsWith('*') && subPart.length > 2) {
                    return <em key={`i-${index}-${subIndex}`}>{subPart.slice(1, -1)}</em>
                }
                return subPart
            })
        }

        return part
    }).flat()
}

/**
 * Style object for formatted text containers
 */
export const formattedTextStyle: React.CSSProperties = {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
}
