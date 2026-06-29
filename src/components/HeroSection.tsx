import { motion } from 'framer-motion'
import FadeIn from './FadeIn'
import Magnet from './Magnet'
import ContactButton from './ContactButton'

const NAV_LINKS = ['About', 'Price', 'Projects', 'Contact']

export default function HeroSection() {
  return (
    <section
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'clip',
        background: '#0C0C0C',
        position: 'relative',
      }}
    >
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="px-6 md:px-10 pt-6 md:pt-8">
        <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
          {NAV_LINKS.map(link => (
            <a
              key={link}
              href="#"
              className="text-sm md:text-lg lg:text-[1.4rem] hover:opacity-70 transition-opacity duration-200"
              style={{
                color: '#D7E2EA',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textDecoration: 'none',
              }}
            >
              {link}
            </a>
          ))}
        </nav>
      </FadeIn>

      {/* Heading */}
      <div style={{ overflow: 'hidden' }}>
        <FadeIn delay={0.15} y={40}>
          <h1
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] mt-6 sm:mt-4 md:-mt-5 px-6 md:px-10"
          >
            Hi, i&apos;m jack
          </h1>
        </FadeIn>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom bar */}
      <div
        className="px-6 md:px-10 pb-7 sm:pb-8 md:pb-10"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
      >
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{
              color: '#D7E2EA',
              fontWeight: 300,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              lineHeight: 1.35,
              fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)',
            }}
          >
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Portrait — centered absolute */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Magnet padding={150} strength={3}>
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
              alt="Jack — 3D Creator"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Magnet>
        </motion.div>
      </div>
    </section>
  )
}
