import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './LinkDisplay.module.scss'

interface LinkDisplayProps {
  link: string
  children?: any
  onClick?: () => void
  style?: string
}

const LinkDisplay = ({ link, children, onClick, style }: LinkDisplayProps) => {
  const router = useRouter()

  return (
    <Link
      onClick={onClick}
      href={link}
      className={`${style} ${router.pathname === link ? styles.link__selected : ''} `}
    >
      {children}
    </Link>
  )
}

export default LinkDisplay
