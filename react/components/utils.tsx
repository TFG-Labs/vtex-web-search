import React from 'react'

/**
 * Given a query and a label: wrap the term in a bold span for styling
 */

export const highlightTerm = (label: string, query: string) => {
  const splittedLabel = label.split(query)

  return (
    <>
      {splittedLabel.map((str: string, index: number) => {
        return (
          <>
            {str}
            {index !== splittedLabel.length - 1 ? (
              <span className="b">{query}</span>
            ) : null}
          </>
        )
      })}
    </>
  )
}
