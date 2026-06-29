import { useRef, useEffect } from 'react'

const IMGS = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
]

const ROW1 = [...IMGS.slice(0, 11), ...IMGS.slice(0, 11), ...IMGS.slice(0, 11)]
const ROW2 = [...IMGS.slice(11), ...IMGS.slice(11), ...IMGS.slice(11)]

const IMG_STYLE: React.CSSProperties = {
  width: 420,
  height: 270,
  borderRadius: 16,
  objectFit: 'cover',
  flexShrink: 0,
  display: 'block',
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return
      const sectionTop =
        sectionRef.current.getBoundingClientRect().top + window.scrollY
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3
      if (row1Ref.current)
        row1Ref.current.style.transform = `translateX(${offset - 200}px)`
      if (row2Ref.current)
        row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="pt-24 sm:pt-32 md:pt-40 pb-10"
      style={{ background: '#0C0C0C', overflowX: 'hidden' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div ref={row1Ref} style={{ display: 'flex', gap: 12, willChange: 'transform' }}>
          {ROW1.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" style={IMG_STYLE} />
          ))}
        </div>
        <div ref={row2Ref} style={{ display: 'flex', gap: 12, willChange: 'transform' }}>
          {ROW2.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy" style={IMG_STYLE} />
          ))}
        </div>
      </div>
    </section>
  )
}
