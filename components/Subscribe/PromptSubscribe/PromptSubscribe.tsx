import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import ModalDisplay from '../../ModalDisplay/ModalDisplay'
// import Subscribe from '../../Subscribe/Subscribe'

const PromptSubscribe = () => {
  const [promptUser, setPromptUser] = useState(false)

  const dateToday = dayjs('2018-08-08')
  console.log('dateToday', dateToday)
  const closeModal = () => {
    // dispatch({ type: HIDE_SUBSCRIBE })
    setPromptUser(false)
  }
  // const checkDisplayPrompt = () => {
  //   const today = dayjs().get('date')
  //   const lastPrompt = moment(localStorage.getItem('subscribePrompt'))
  //   const isSubscribed = localStorage.getItem('submit')
  //   const days = moment(today).diff(lastPrompt, 'days')

  //   const prompt = (isNaN(days) || days > 30) && !isSubscribed

  //   if (prompt && 'localStorage' in window) {
  //     localStorage.setItem('subscribePrompt', today)
  //   }

  //   return prompt
  // }
  // useEffect(() => {
  //   const subscribeTimer = setTimeout(() => {
  //     setPromptUser(checkDisplayPrompt())
  //   }, 5000)
  //   return () => clearTimeout(subscribeTimer)
  // }, [])

  return (
    <ModalDisplay isOpen={promptUser} closeModal={closeModal}>
      {/* <Subscribe /> */}
    </ModalDisplay>
  )
}

export default PromptSubscribe
