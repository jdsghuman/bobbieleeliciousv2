import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './LinkDisplay.module.scss'

const LinkDisplay = ({ link, children }) => {
  const router = useRouter()

  let className = children.props.className || ''
  if (router.pathname === link) {
    className = `${className} ${styles.link__selected}`
  }

  useEffect(() => {
    if (router.pathname === link) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      className = `${className} ${styles.link__selected}`
    }
  }, [])

  return <Link href={link}>{React.cloneElement(children, { className })}</Link>
}

export default LinkDisplay
