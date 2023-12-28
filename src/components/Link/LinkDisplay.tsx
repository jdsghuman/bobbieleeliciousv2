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

  let className = children?.props?.className || ''
  if (router.pathname === link) {
    className = `${className} ${styles.link__selected}`
  }

  useEffect(() => {
    if (router.pathname === link) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      className = `${className} ${styles.link__selected}`
    }
  }, [])

  return (
    <Link onClick={onClick} href={link} className={style}>
      {/* {React.cloneElement(children, { className })} */}
      {children}
    </Link>
  )
}

export default LinkDisplay
