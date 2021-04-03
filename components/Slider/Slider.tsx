import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon/Icon'
import smoothscroll from 'smoothscroll-polyfill'
import styles from './Slider.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

interface SliderPropType {
  items: any
  toggleSliderOption: (item: string) => void
  selected?: string
}

const Slider = ({ toggleSliderOption, items, selected }: SliderPropType) => {
  console.log(
    'items----',
    items.data.map((category) => category)
  )
  const ref = useRef<HTMLDivElement>(null)

  const scroll = (scrollOffset) => {
    ref.current.scrollLeft += scrollOffset
  }

  useEffect(() => {
    smoothscroll.polyfill()
  }, [])
  return (
    <div className={styles.container__slider}>
      <Icon
        identifier="chevronBack"
        viewBox="0 0 512 512"
        fill="none"
        stroke="#888888"
        strokeWidth="22"
        className={styles.arrow}
        click={() => scroll(-60)}
      />
      <div ref={ref} className={styles.container}>
        {items.data.map((item) => {
          return (
            <div
              key={item.sys.id}
              onClick={() => toggleSliderOption(item.fields.name)}
              className={cx('item', {
                'item-clicked': selected.includes(item.fields.name),
              })}
            >
              <p
                className={cx('item-title', 'unselectable', {
                  'item-title-clicked': selected.includes(item.fields.name),
                })}
              >
                {item.fields.name}
              </p>
            </div>
          )
        })}
      </div>
      <Icon
        identifier="chevronForward"
        viewBox="0 0 512 512"
        fill="none"
        stroke="#888888"
        strokeWidth="15"
        className={styles.arrow}
        click={() => scroll(60)}
      />
    </div>
  )
}

Slider.propTypes = {
  items: PropTypes.array.isRequired,
  toggleSliderOption: PropTypes.func,
  selected: PropTypes.string,
}

export default Slider
