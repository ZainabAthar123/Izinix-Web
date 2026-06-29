import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'

function AnimChar({
  char,
  progress,
  index,
  total,
}: {
  char: string
  progress: MotionValue<number>
  index: number
  total: number
}) {
  const start = index / total
  const end = (index + 1) / total
  const opacity = useTransform(progress, [start, end], [0.2, 1])
  return (
    <span style={{ position: 'relative', display: 'inline', whiteSpace: 'pre' }}>
      <span style={{ visibility: 'hidden' }}>{char}</span>
      <motion.span style={{ opacity, position: 'absolute', left: 0, top: 0 }}>
        {char}
      </motion.span>
    </span>
  )
}

interface Props {
  text: string
  className?: string
  style?: React.CSSProperties
}

export default function AnimatedText({ text, className, style }: Props) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })
  const chars = text.split('')
  return (
    <p ref={ref} className={className} style={{ position: 'relative', ...style }}>
      {chars.map((c, i) => (
        <AnimChar key={i} char={c} progress={scrollYProgress} index={i} total={chars.length} />
      ))}
    </p>
  )
}
