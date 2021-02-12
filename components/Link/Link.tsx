import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './Link.module.scss'

const LinkDisplay = ({ href, children }) => {
  const router = useRouter()

  let className = children.props.className || ''
  if (router.pathname === href) {
    className = `${className} ${styles.link__selected}`
  }

  useEffect(() => {
    if (router.pathname === href) {
      className = `${className} ${styles.link__selected}`
    }
  }, [])

  return <Link href={href}>{React.cloneElement(children, { className })}</Link>
}

export default LinkDisplay
