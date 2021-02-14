import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import styles from './Button.module.scss'

const cx = classNames.bind(styles)

interface ButtonPropTypes extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type: any
  className?: string
  children: any
  primary?: boolean
  accent?: boolean
  onClick?: any
}

const Button = ({ children, type, className, primary, accent, onClick }: ButtonPropTypes) => (
  <button
    type={type}
    className={cx('button', className, {
      'button--primary': primary,
      'button--accent': accent,
    })}
    onClick={onClick}
  >
    {children}
  </button>
)

Button.propTypes = {
  type: PropTypes.string.isRequired,
}

Button.defaultPropTypes = {
  type: 'button',
}

export default Button
