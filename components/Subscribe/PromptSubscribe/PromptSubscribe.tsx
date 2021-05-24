import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import ModalDisplay from '../../ModalDisplay/ModalDisplay'
import SubscribeModal from '../SubscribeModal/SubscribeModal'

const PromptSubscribe = () => {
  const [promptUser, setPromptUser] = useState(false)

  const closeModal = () => {
    setPromptUser(false)
  }
  const checkDisplayPrompt = () => {
    const today = dayjs().toDate()
    const lastPrompt = dayjs(localStorage.getItem('subscribePrompt'))
    const isSubscribed = localStorage.getItem('submit')
    const days = dayjs(today).diff(lastPrompt, 'days')

    const prompt = ((isNaN(days) || days >= 1) && !isSubscribed) || isNaN(days) || days >= 30

    if (prompt && 'localStorage' in window) {
      localStorage.setItem('subscribePrompt', '' + today)
    }

    return prompt
  }
  useEffect(() => {
    const subscribeTimer = setTimeout(() => {
      setPromptUser(checkDisplayPrompt())
    }, 5000)
    return () => clearTimeout(subscribeTimer)
  }, [])

  return (
    <ModalDisplay isOpen={promptUser} closeModal={closeModal}>
      <SubscribeModal closeModal={closeModal} />
    </ModalDisplay>
  )
}

export default PromptSubscribe
