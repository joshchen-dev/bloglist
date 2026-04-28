import { useImperativeHandle, useState } from 'react'
import { Button } from './ui/Button'

const Toggable = (props) => {
  const [visibility, setVisibility] = useState(false)

  const showWhenVisible = { display: visibility ? '' : 'none' }
  const hideWhenVisible = { display: visibility ? 'none' : '' }

  const toggleVisibility = () => {
    setVisibility(!visibility)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.targetLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  )
}

export default Toggable