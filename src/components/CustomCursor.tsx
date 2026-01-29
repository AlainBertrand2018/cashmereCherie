import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const dotRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const cursor = cursorRef.current
        const dot = dotRef.current
        if (!cursor || !dot) return

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.6,
                ease: 'power3.out',
            })
            gsap.to(dot, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power3.out',
            })
        }

        const handleMouseEnter = () => {
            gsap.to(cursor, {
                scale: 1.5,
                backgroundColor: 'rgba(201, 168, 124, 0.2)',
                borderColor: 'rgba(201, 168, 124, 0.5)',
                duration: 0.3,
            })
        }

        const handleMouseLeave = () => {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: 'transparent',
                borderColor: 'rgba(43, 43, 43, 0.2)',
                duration: 0.3,
            })
        }

        window.addEventListener('mousemove', moveCursor)

        const interactiveElements = document.querySelectorAll('button, a, .cursor-pointer')
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter)
            el.addEventListener('mouseleave', handleMouseLeave)
        })

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter)
                el.removeEventListener('mouseleave', handleMouseLeave)
            })
        }
    }, [])

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 border border-charcoal/20 rounded-full z-[9999] pointer-events-none hidden lg:block"
            />
            <div
                ref={dotRef}
                className="fixed top-0 left-0 w-1 h-1 -ml-0.5 -mt-0.5 bg-camel rounded-full z-[9999] pointer-events-none hidden lg:block"
            />
        </>
    )
}
