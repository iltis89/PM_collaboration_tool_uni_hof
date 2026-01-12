import styles from './Skeleton.module.css'

interface SkeletonProps {
    className?: string
    style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
    return <div className={`${styles.skeleton} ${className || ''}`} style={style} />
}

export function SkeletonText({ className }: SkeletonProps) {
    return <div className={`${styles.skeletonText} ${className || ''}`} />
}

export function SkeletonTextShort({ className }: SkeletonProps) {
    return <div className={`${styles.skeletonTextShort} ${className || ''}`} />
}

export function SkeletonTitle({ className }: SkeletonProps) {
    return <div className={`${styles.skeletonTitle} ${className || ''}`} />
}

export function SkeletonCard({ className }: SkeletonProps) {
    return <div className={`${styles.skeletonCard} ${className || ''}`} />
}

export function SkeletonAvatar({ className }: SkeletonProps) {
    return <div className={`${styles.skeletonAvatar} ${className || ''}`} />
}

// Pre-composed skeleton layouts
export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className={styles.skeletonContainer}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={styles.skeletonRow}>
                    <SkeletonAvatar />
                    <div style={{ flex: 1 }}>
                        <SkeletonTitle />
                        <SkeletonText />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
    return (
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    )
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number, cols?: number }) {
    return (
        <div className={styles.skeletonContainer}>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                    {Array.from({ length: cols }).map((_, j) => (
                        <div key={j} style={{ flex: 1 }}>
                            <SkeletonText />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
