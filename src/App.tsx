import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, X, ShoppingCart, ArrowRight, Plus, ArrowUpRight } from 'lucide-react'
import Lenis from 'lenis'
import Loader from './components/Loader'
import CustomCursor from './components/CustomCursor'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

// Navigation Component
function Navigation({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-ivory/90 backdrop-blur-sm' : 'bg-transparent'
          }`}
      >
        <div className="flex items-center justify-between px-6 lg:px-12 py-5">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 hover:opacity-60 transition-opacity"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-charcoal" strokeWidth={1.5} />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="font-serif text-sm tracking-[0.25em] uppercase text-charcoal font-medium">
              Cashmere Cherie
            </h1>
          </div>

          <button className="p-2 hover:opacity-60 transition-opacity flex items-center gap-2">
            <span className="text-xs tracking-wide text-charcoal">CART (0)</span>
            <ShoppingCart className="w-4 h-4 text-charcoal" strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <div
        className={`fixed inset-0 z-[100] bg-ivory/97 transition-all duration-500 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="flex flex-col h-full px-8 lg:px-16 py-8">
          <div className="flex justify-end">
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 hover:opacity-60 transition-opacity"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-charcoal" strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center gap-8">
            {['Collections', 'New Arrivals', 'Loungewear', 'Shisha Lounge', 'Journal', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-3xl lg:text-5xl text-charcoal hover:text-camel transition-colors tracking-tight"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// Announcement Bar
function AnnouncementBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (barRef.current) {
      gsap.fromTo(barRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power2.out' }
      )
    }
  }, [])

  return (
    <div
      ref={barRef}
      className="fixed top-[72px] left-0 right-0 z-40 bg-charcoal text-ivory py-2.5 text-center"
    >
      <p className="text-[11px] tracking-[0.18em] uppercase font-medium">
        Free Delivery All Over the Island
      </p>
    </div>
  )
}

// Hero Section
function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const wipeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Load animation
      const loadTl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 1.4 }
      })

      loadTl.fromTo(bgRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1 }
      )

      loadTl.fromTo(wipeRef.current,
        { x: '-60vw' },
        { x: 0 },
        0.1
      )

      loadTl.fromTo('.hero-title',
        { y: '5vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1 },
        0.3
      )

      loadTl.fromTo('.hero-text',
        { y: '3vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08 },
        0.5
      )

      loadTl.fromTo('.hero-card',
        { x: '10vw', opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, stagger: 0.15 },
        0.4
      )

      // Scroll animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set('.hero-title, .hero-text, .hero-card', { opacity: 1, x: 0, y: 0 })
          }
        }
      })

      // Exit phase (70%-100%)
      scrollTl.fromTo(wipeRef.current,
        { x: 0 },
        { x: '-70vw', ease: 'power3.in' },
        0.7
      )

      scrollTl.fromTo('.hero-title',
        { x: 0, opacity: 1 },
        { x: '-15vw', opacity: 0, ease: 'power3.in' },
        0.7
      )

      scrollTl.fromTo('.hero-text',
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power3.in' },
        0.72
      )

      scrollTl.fromTo('.hero-card',
        { x: 0, opacity: 1 },
        { x: '25vw', opacity: 0, ease: 'power3.in' },
        0.7
      )

      scrollTl.fromTo(bgRef.current,
        { scale: 1 },
        { scale: 1.06, ease: 'none' },
        0.7
      )

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 10 }}
    >
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="/hero_lounge_sofa.jpg"
          alt="Cashmere lifestyle"
          className="w-full h-full object-cover"
        />
        <div className="vignette-overlay" />
      </div>

      {/* Diagonal Wipe Panel */}
      <div
        ref={wipeRef}
        className="absolute inset-0 bg-ivory"
        style={{ clipPath: 'polygon(0 0, 55% 0, 45% 100%, 0 100%)' }}
      />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <div className="max-w-xl">
          <h2 className="hero-title font-serif text-hero text-charcoal leading-[0.9] tracking-tight">
            SOFT
          </h2>
          <h2 className="hero-title font-serif text-hero text-charcoal leading-[0.9] tracking-tight mt-2">
            KNITS
          </h2>
          <p className="hero-text font-serif italic text-xl text-warmgray mt-6">
            Quiet luxury for slow days.
          </p>
          <p className="hero-text text-sm text-warmgray mt-6 max-w-md leading-relaxed">
            Cashmere Cherie is a concept store where effortless knitwear meets the ritual of the lounge.
            Designed for the island pace—soft, warm, and intentionally unhurried.
          </p>

          <div className="hero-text flex gap-4 mt-8">
            <button className="px-6 py-3 bg-charcoal text-ivory text-xs tracking-[0.15em] uppercase hover:bg-camel transition-colors duration-300">
              Explore Collection
            </button>
            <button className="px-6 py-3 border border-charcoal text-charcoal text-xs tracking-[0.15em] uppercase hover:bg-charcoal hover:text-ivory transition-colors duration-300">
              Reserve Table
            </button>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div
        ref={cardsRef}
        className="absolute right-[4vw] top-[18vh] hidden lg:flex gap-4"
      >
        <div className="hero-card w-[16vw] h-[64vh] relative overflow-hidden group cursor-pointer">
          <img
            src="/cat_cashmere_texture.jpg"
            alt="Cashmere"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 bg-ivory py-4 px-4">
            <p className="text-xs tracking-[0.18em] uppercase text-charcoal font-medium">Cashmere</p>
          </div>
          <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-ivory opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
        </div>

        <div className="hero-card w-[16vw] h-[64vh] relative overflow-hidden group cursor-pointer">
          <img
            src="/cat_shisha_detail.jpg"
            alt="Shisha Lounge"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 bg-ivory py-4 px-4">
            <p className="text-xs tracking-[0.18em] uppercase text-charcoal font-medium">Shisha</p>
          </div>
          <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-ivory opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
        </div>
      </div>
    </section>
  )
}

// Collection Section
function CollectionSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      })

      // Entrance (0-30%)
      scrollTl.fromTo(bgRef.current,
        { scale: 1.1, x: '8vw', opacity: 0.6 },
        { scale: 1, x: 0, opacity: 1, ease: 'none' },
        0
      )

      scrollTl.fromTo('.collection-title',
        { y: '-18vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      )

      scrollTl.fromTo('.collection-text',
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      )

      // Exit (70-100%)
      scrollTl.fromTo('.collection-title',
        { x: 0, opacity: 1 },
        { x: '-14vw', opacity: 0, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo('.collection-text',
        { y: 0, opacity: 1 },
        { y: '10vh', opacity: 0, ease: 'power2.in' },
        0.72
      )

      scrollTl.fromTo(bgRef.current,
        { scale: 1, x: 0 },
        { scale: 1.07, x: '-6vw', ease: 'none' },
        0.7
      )

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 20 }}
    >
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <img
          src="/collection_still_life.jpg"
          alt="Collection still life"
          className="w-full h-full object-cover"
        />
        <div className="vignette-overlay" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <h2 className="collection-title font-serif text-section text-ivory leading-[0.9] tracking-tight text-shadow-soft">
          THE
        </h2>
        <h2 className="collection-title font-serif text-section text-ivory leading-[0.9] tracking-tight mt-2 text-shadow-soft">
          COLLECTION
        </h2>
        <p className="collection-text text-sm text-ivory/80 mt-8 max-w-md leading-relaxed">
          Seasonal essentials in neutral tones—pieces that move from sofa to street without losing their shape.
        </p>
        <a
          href="#collection"
          className="collection-text inline-flex items-center gap-2 text-ivory text-xs tracking-[0.15em] uppercase mt-8 group w-fit"
        >
          <span className="relative">
            Shop the latest drop
            <span className="absolute bottom-0 left-0 w-full h-px bg-ivory origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-300" />
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
        </a>
      </div>
    </section>
  )
}

// Featured Product Section
function FeaturedProductSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        }
      })

      // Entrance
      scrollTl.fromTo(bgRef.current,
        { scale: 1.08, y: '6vh', opacity: 0.7 },
        { scale: 1, y: 0, opacity: 1, ease: 'none' },
        0
      )

      scrollTl.fromTo('.featured-title',
        { x: '-20vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      )

      scrollTl.fromTo('.featured-text',
        { y: '12vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0.05
      )

      scrollTl.fromTo(cardRef.current,
        { x: '22vw', opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )

      // Exit
      scrollTl.fromTo('.featured-title, .featured-text',
        { x: 0, opacity: 1 },
        { x: '-12vw', opacity: 0, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo(cardRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo(bgRef.current,
        { scale: 1 },
        { scale: 1.06, ease: 'none' },
        0.7
      )

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 30 }}
    >
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <img
          src="/featured_product_sofa.jpg"
          alt="Featured product"
          className="w-full h-full object-cover"
        />
        <div className="vignette-overlay" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <h2 className="featured-title font-serif text-section text-ivory leading-[0.9] tracking-tight text-shadow-soft">
          FEATURED
        </h2>
        <h2 className="featured-title font-serif text-section text-ivory leading-[0.9] tracking-tight mt-2 text-shadow-soft">
          PIECE
        </h2>
        <p className="featured-text font-serif text-2xl text-ivory mt-6 text-shadow-soft">
          MUR 1890
        </p>
        <p className="featured-text text-sm text-ivory/80 mt-4 max-w-sm leading-relaxed">
          A relaxed cashmere set designed for slow mornings and long evenings. Soft structure, easy drape.
        </p>
        <button className="featured-text mt-8 px-8 py-3 bg-ivory text-charcoal text-xs tracking-[0.15em] uppercase hover:bg-camel hover:text-ivory transition-colors duration-300 w-fit">
          Add to Cart
        </button>
      </div>

      {/* Product Card */}
      <div
        ref={cardRef}
        className="absolute right-[6vw] top-[22vh] w-[280px] lg:w-[30vw] bg-ivory shadow-soft p-4 hidden lg:block"
      >
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src="/featured_product_thumb.jpg"
            alt="Cashmere Relaxed Set"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mt-4">
          <p className="text-xs tracking-[0.15em] uppercase text-warmgray">Cashmere Relaxed Set</p>
          <p className="font-serif text-lg text-charcoal mt-1">MUR 1890</p>
          <button className="w-full mt-4 py-3 bg-charcoal text-ivory text-xs tracking-[0.15em] uppercase hover:bg-camel transition-colors duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  )
}

// Lounge Section
function LoungeSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.7,
        }
      })

      // Entrance
      scrollTl.fromTo(bgRef.current,
        { scale: 1.12, opacity: 0.6 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      )

      scrollTl.fromTo('.lounge-title',
        { y: '-16vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      )

      scrollTl.fromTo('.lounge-text',
        { y: '12vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      )

      scrollTl.fromTo(cardRef.current,
        { x: '26vw', opacity: 0, scale: 0.97 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )

      scrollTl.fromTo('.lounge-icon',
        { scale: 0, rotate: -45 },
        { scale: 1, rotate: 0, ease: 'none' },
        0.1
      )

      // Exit
      scrollTl.fromTo('.lounge-title, .lounge-text',
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo(cardRef.current,
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo(bgRef.current,
        { scale: 1 },
        { scale: 1.07, ease: 'none' },
        0.7
      )

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 40 }}
    >
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <img
          src="/lounge_social_scene.jpg"
          alt="Lounge atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="vignette-overlay" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <h2 className="lounge-title font-serif text-section text-ivory leading-[0.9] tracking-tight text-shadow-soft">
          LOUNGE
        </h2>
        <h2 className="lounge-title font-serif text-section text-ivory leading-[0.9] tracking-tight mt-2 text-shadow-soft">
          ATMOSPHERE
        </h2>
        <p className="lounge-text text-sm text-ivory/80 mt-8 max-w-md leading-relaxed">
          A calm space to share stories over slow-drawn flavors. Reserve your table and unwind into the evening.
        </p>
        <button className="lounge-text mt-8 px-8 py-3 bg-ivory text-charcoal text-xs tracking-[0.15em] uppercase hover:bg-camel hover:text-ivory transition-colors duration-300 w-fit">
          Book a Table
        </button>
      </div>

      {/* Right Card */}
      <div
        ref={cardRef}
        className="absolute right-[4vw] top-[18vh] w-[28vw] h-[64vh] hidden lg:block overflow-hidden group cursor-pointer"
      >
        <img
          src="/lounge_smoke_card.jpg"
          alt="Lounge detail"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="lounge-icon absolute top-4 right-4 w-10 h-10 rounded-full bg-ivory/90 flex items-center justify-center">
          <Plus className="w-5 h-5 text-charcoal" strokeWidth={1.5} />
        </div>
      </div>
    </section>
  )
}

// Craft Section
function CraftSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      })

      // Entrance
      scrollTl.fromTo(bgRef.current,
        { scale: 1.1, x: '-6vw', opacity: 0.7 },
        { scale: 1, x: 0, opacity: 1, ease: 'none' },
        0
      )

      scrollTl.fromTo('.craft-title',
        { x: '-18vw', opacity: 0 },
        { x: 0, opacity: 1, ease: 'none' },
        0
      )

      scrollTl.fromTo('.craft-text',
        { y: '10vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0.05
      )

      scrollTl.fromTo(cardRef.current,
        { x: '22vw', opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, ease: 'none' },
        0
      )

      // Exit
      scrollTl.fromTo('.craft-title, .craft-text',
        { x: 0, opacity: 1 },
        { x: '-12vw', opacity: 0, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo(cardRef.current,
        { x: 0, opacity: 1 },
        { x: '16vw', opacity: 0, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo(bgRef.current,
        { scale: 1 },
        { scale: 1.06, ease: 'none' },
        0.7
      )

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 50 }}
    >
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <img
          src="/craft_texture_hands.jpg"
          alt="Cashmere craft"
          className="w-full h-full object-cover"
        />
        <div className="vignette-overlay" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <h2 className="craft-title font-serif text-section text-ivory leading-[0.9] tracking-tight text-shadow-soft">
          CASHMERE
        </h2>
        <h2 className="craft-title font-serif text-section text-ivory leading-[0.9] tracking-tight mt-2 text-shadow-soft">
          CRAFT
        </h2>
        <p className="craft-text text-sm text-ivory/80 mt-8 max-w-md leading-relaxed">
          Responsibly sourced fibers, finished by hand. Built to last—and to soften with every wear.
        </p>
        <a
          href="#story"
          className="craft-text inline-flex items-center gap-2 text-ivory text-xs tracking-[0.15em] uppercase mt-8 group w-fit"
        >
          <span className="relative">
            Read the story
            <span className="absolute bottom-0 left-0 w-full h-px bg-ivory origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-300" />
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
        </a>
      </div>

      {/* Details Card */}
      <div
        ref={cardRef}
        className="absolute right-[4vw] top-[20vh] w-[30vw] bg-ivory shadow-soft p-6 hidden lg:block"
      >
        <div className="aspect-square overflow-hidden mb-6">
          <img
            src="/craft_yarn_detail.jpg"
            alt="Yarn detail"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-warmgray">Material</span>
            <span className="text-charcoal">100% Grade-A cashmere</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-warmgray">Fit</span>
            <span className="text-charcoal">Relaxed, true to size</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-warmgray">Care</span>
            <span className="text-charcoal">Hand wash cold; dry flat</span>
          </div>
        </div>
        <a href="#care" className="inline-block mt-6 text-xs tracking-[0.15em] uppercase text-camel hover:text-charcoal transition-colors">
          Read more
        </a>
      </div>
    </section>
  )
}

// Gallery Section
function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.7,
        }
      })

      // Entrance
      scrollTl.fromTo(bgRef.current,
        { scale: 1.12, opacity: 0.6 },
        { scale: 1, opacity: 1, ease: 'none' },
        0
      )

      scrollTl.fromTo('.gallery-title, .gallery-text',
        { y: '12vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
        0
      )

      scrollTl.fromTo('.gallery-card',
        { x: '18vw', opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, stagger: 0.03, ease: 'none' },
        0
      )

      // Exit
      scrollTl.fromTo('.gallery-title, .gallery-text',
        { y: 0, opacity: 1 },
        { y: '-10vh', opacity: 0, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo('.gallery-card',
        { x: 0, opacity: 1 },
        { x: '18vw', opacity: 0, ease: 'power2.in' },
        0.7
      )

      scrollTl.fromTo(bgRef.current,
        { scale: 1 },
        { scale: 1.06, ease: 'none' },
        0.7
      )

    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ zIndex: 60 }}
    >
      <div ref={bgRef} className="absolute inset-0 w-full h-full">
        <img
          src="/gallery_hero_coat.jpg"
          alt="Gallery atmosphere"
          className="w-full h-full object-cover"
        />
        <div className="vignette-overlay" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 lg:px-[6vw]">
        <h2 className="gallery-title font-serif text-section text-ivory leading-[0.9] tracking-tight text-shadow-soft">
          ATMOSPHERE
        </h2>
        <h2 className="gallery-title font-serif text-section text-ivory leading-[0.9] tracking-tight mt-2 text-shadow-soft">
          GALLERY
        </h2>
        <p className="gallery-text text-sm text-ivory/80 mt-8 max-w-md leading-relaxed">
          Three moods of the house: light, texture, and the quiet joy of good company.
        </p>
        <button className="gallery-text mt-8 px-8 py-3 bg-ivory text-charcoal text-xs tracking-[0.15em] uppercase hover:bg-camel hover:text-ivory transition-colors duration-300 w-fit">
          View Gallery
        </button>
      </div>

      {/* Floating Cards */}
      <div className="absolute right-[4vw] top-[16vh] hidden lg:block">
        <div className="gallery-card w-[16vw] h-[22vh] overflow-hidden mb-4 group cursor-pointer">
          <img
            src="/gallery_card_1.jpg"
            alt="Gallery 1"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <ArrowUpRight className="absolute top-2 right-2 w-4 h-4 text-ivory opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
        </div>
        <div className="flex gap-4">
          <div className="gallery-card w-[16vw] h-[22vh] overflow-hidden group cursor-pointer">
            <img
              src="/gallery_card_2.jpg"
              alt="Gallery 2"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <ArrowUpRight className="absolute top-2 right-2 w-4 h-4 text-ivory opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
          </div>
          <div className="gallery-card w-[16vw] h-[22vh] overflow-hidden group cursor-pointer">
            <img
              src="/gallery_card_3.jpg"
              alt="Gallery 3"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <ArrowUpRight className="absolute top-2 right-2 w-4 h-4 text-ivory opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </section>
  )
}

// Quick Shop Section
function QuickShopSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)

  const products = [
    { id: 1, name: 'Cashmere Sweater', price: 'MUR 2450', image: '/product_01.jpg' },
    { id: 2, name: 'Camel Cardigan', price: 'MUR 2890', image: '/product_02.jpg' },
    { id: 3, name: 'Silk Scarf', price: 'MUR 1250', image: '/product_03.jpg' },
    { id: 4, name: 'Lounge Pants', price: 'MUR 1890', image: '/product_04.jpg' },
  ]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.shop-header',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        }
      )

      gsap.fromTo('.shop-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          }
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="collection"
      className="relative w-full py-24 lg:py-32 bg-ivory"
    >
      <div className="px-6 lg:px-[6vw]">
        <div className="shop-header text-center mb-16">
          <p className="text-xs tracking-[0.18em] uppercase text-warmgray mb-4">Quick Shop</p>
          <h2 className="font-serif text-4xl lg:text-6xl text-charcoal tracking-tight">Top Picks</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="shop-card group cursor-pointer"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-charcoal/60 flex items-center justify-center transition-opacity duration-300 ${hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                  <button className="px-6 py-3 bg-ivory text-charcoal text-xs tracking-[0.15em] uppercase hover:bg-camel hover:text-ivory transition-colors duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-charcoal">{product.name}</p>
                <p className="text-xs text-warmgray mt-1">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Journal Section
function JournalSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const posts = [
    {
      id: 1,
      title: 'How to care for cashmere at home',
      excerpt: 'Simple steps to keep your knits soft and beautiful for years to come.',
      image: '/journal_featured.jpg',
      featured: true,
    },
    {
      id: 2,
      title: 'A short guide to slow evenings',
      excerpt: 'Creating rituals that help you unwind.',
      image: '/journal_01.jpg',
      featured: false,
    },
    {
      id: 3,
      title: 'What to wear to the lounge',
      excerpt: 'Effortless style for relaxed moments.',
      image: '/journal_02.jpg',
      featured: false,
    },
  ]

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.journal-header',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        }
      )

      gsap.fromTo('.journal-featured-img',
        { x: -60, opacity: 0, scale: 1.03 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          }
        }
      )

      gsap.fromTo('.journal-featured-text',
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          }
        }
      )

      gsap.fromTo('.journal-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
          }
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="journal"
      className="relative w-full py-24 lg:py-32 bg-ivory"
    >
      <div className="px-6 lg:px-[6vw]">
        <div className="journal-header mb-16">
          <p className="text-xs tracking-[0.18em] uppercase text-warmgray mb-4">Journal</p>
          <h2 className="font-serif text-4xl lg:text-6xl text-charcoal tracking-tight">Care, style, and slow living.</h2>
        </div>

        {/* Featured Post */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="journal-featured-img lg:w-[55%] aspect-[16/10] overflow-hidden">
            <img
              src={posts[0].image}
              alt={posts[0].title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="journal-featured-text lg:w-[45%] flex flex-col justify-center">
            <p className="text-xs tracking-[0.18em] uppercase text-camel mb-4">Featured</p>
            <h3 className="font-serif text-2xl lg:text-3xl text-charcoal mb-4">{posts[0].title}</h3>
            <p className="text-sm text-warmgray leading-relaxed mb-6">{posts[0].excerpt}</p>
            <a href="#" className="inline-flex items-center gap-2 text-charcoal text-xs tracking-[0.15em] uppercase group w-fit">
              <span className="relative">
                Read more
                <span className="absolute bottom-0 left-0 w-full h-px bg-charcoal origin-left scale-x-100 group-hover:scale-x-0 transition-transform duration-300" />
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Other Posts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.slice(1).map((post) => (
            <div key={post.id} className="journal-card group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden mb-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-xl text-charcoal mb-2 group-hover:text-camel transition-colors">{post.title}</h3>
              <p className="text-sm text-warmgray">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer Section
function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.footer-col',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for subscribing!')
    setEmail('')
  }

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="relative w-full py-16 lg:py-24 bg-stone"
    >
      <div className="px-6 lg:px-[6vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-16">
          {/* Contact Info */}
          <div className="footer-col">
            <h3 className="font-serif text-3xl text-charcoal mb-8">Visit Us</h3>
            <div className="space-y-4 text-sm text-warmgray">
              <p>12, Rue de la Paix, Port Louis, Mauritius</p>
              <p>Mon–Sat: 10am–8pm / Sun: 12pm–6pm</p>
              <p>+230 123 4567</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h3 className="font-serif text-3xl text-charcoal mb-8">Join the List</h3>
            <p className="text-sm text-warmgray mb-6">
              New drops, lounge events, and care notes—delivered softly.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 px-4 py-3 bg-ivory border-none text-sm text-charcoal placeholder:text-warmgray focus:outline-none focus:ring-1 focus:ring-camel"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-charcoal text-ivory text-xs tracking-[0.15em] uppercase hover:bg-camel transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="footer-col flex flex-col lg:flex-row justify-between items-center pt-8 border-t border-charcoal/10">
          <div className="flex gap-6 mb-4 lg:mb-0">
            <a href="#" className="text-xs tracking-[0.15em] uppercase text-warmgray hover:text-charcoal transition-colors">Instagram</a>
            <a href="#" className="text-xs tracking-[0.15em] uppercase text-warmgray hover:text-charcoal transition-colors">Facebook</a>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-xs tracking-[0.15em] uppercase text-warmgray hover:text-charcoal transition-colors">Shipping & Returns</a>
            <a href="#" className="text-xs tracking-[0.15em] uppercase text-warmgray hover:text-charcoal transition-colors">Privacy</a>
          </div>
        </div>

        <div className="footer-col text-center mt-12">
          <p className="font-serif text-sm tracking-[0.25em] uppercase text-charcoal">
            Cashmere Cherie
          </p>
          <p className="text-xs text-warmgray mt-2">Soft knits. Slow evenings.</p>
        </div>
      </div>
    </footer>
  )
}

// Main App
function App() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Connect ScrollTrigger to Lenis
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Global snap for pinned sections
    const setupSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start)

      const maxScroll = ScrollTrigger.maxScroll(window)
      if (!maxScroll || pinned.length === 0) return

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }))

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02)
            if (!inPinned) return value

            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            )
            return target
          },
          duration: { min: 0.2, max: 0.6 },
          delay: 0,
          ease: 'power3.out',
        }
      })
    }

    // Delay to ensure all ScrollTriggers are created
    const timer = setTimeout(setupSnap, 800)

    return () => {
      clearTimeout(timer)
      lenis.destroy()
      ScrollTrigger.getAll().forEach(st => st.kill())
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return (
    <div className="relative">
      {loading && <Loader onComplete={() => setLoading(false)} />}

      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Custom Cursor */}
      <CustomCursor />


      {/* Navigation */}
      <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Announcement Bar */}
      <AnnouncementBar />


      {/* Main Content */}
      <main ref={mainRef} className="relative">
        <HeroSection />
        <CollectionSection />
        <FeaturedProductSection />
        <LoungeSection />
        <CraftSection />
        <GallerySection />
        <QuickShopSection />
        <JournalSection />
        <FooterSection />
      </main>
    </div>
  )
}

export default App
