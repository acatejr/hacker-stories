import * as React from 'react'

const welcome = {
  greeting: 'Hey',
  title: 'React'
}

function getTitle(title) {
  return title
}

function App() {

  return (
    <div>
      <h1>
        {welcome.greeting} {getTitle('React')}
      </h1>

      <label htmlFor='seach'>Search: </label>
      <input id='search' type='text'/>
    </div>
  )  
}

export default App
