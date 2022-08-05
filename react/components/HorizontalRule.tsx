import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['horizontalRule'] as const

function HorizontalRule() {
  const { handles } = useCssHandles(CSS_HANDLES)
  return <hr className={handles.horizontalRule} />
}

export default HorizontalRule
