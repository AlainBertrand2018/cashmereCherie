import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'

interface LoaderProps {
    onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
    const [progress, setProgress] = useState(0)
    const loaderRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const images = Array.from(document.querySelectorAll('img'))
        const totalImages = images.length
        let loadedCount = 0

        if (totalImages === 0) {
            setProgress(100)
            setTimeout(onComplete, 500)
            return
        }

        const updateProgress = () => {
            loadedCount++
            const p = Math.floor((loadedCount / totalImages) * 100)
            setProgress(p)

            if (loadedCount === totalImages) {
                setTimeout(onComplete, 800)
            }
        }

        images.forEach(img => {
            if (img.complete) {
                updateProgress()
            } else {
                img.addEventListener('load', updateProgress)
                img.addEventListener('error', updateProgress)
            }
        })

        // Animation for the text and background
        gsap.fromTo(textRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )

        return () => {
            images.forEach(img => {
                img.removeEventListener('load', updateProgress)
                img.removeEventListener('error', updateProgress)
            })
        }
    }, [onComplete])

    useEffect(() => {
        if (progress === 100) {
            const tl = gsap.timeline({
                onComplete: () => {
                    // Extra safety if onComplete hasn't been called
                    onComplete()
                }
            })

            tl.to(textRef.current, {
                opacity: 0,
                y: -10,
                duration: 0.5,
                ease: 'power3.in'
            })
            tl.to(loaderRef.current, {
                y: '-100%',
                duration: 1.2,
                ease: 'power4.inOut'
            })
        }
    }, [progress, onComplete])

    return (
        <div
            ref={loaderRef}
            className="fixed inset-0 z-[9999] bg-charcoal flex flex-col items-center justify-center pointer-events-none"
        >
            <div ref={textRef} className="text-center">
                <h2 className="font-serif text-ivory text-2xl tracking-[0.3em] uppercase mb-4">
                    Cashmere Cherie
                </h2>
                <div className="w-48 h-[1px] bg-ivory/20 relative overflow-hidden">
                    <div
                        ref={progressRef}
                        className="absolute top-0 left-0 h-full bg-camel transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-ivory/40 text-[10px] tracking-[0.2em] uppercase mt-4">
                    Loading {progress}%
                </p>
            </div>

            {/* Decorative grain overlay inside loader */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
        </div>
    )
}
