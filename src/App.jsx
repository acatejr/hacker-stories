import * as React from 'react'

const welcome = {
  greeting: 'Hey',
  title: 'React'
}

function getTitle(title) {
  return title
}

const initialStories = [
 {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
  num_comments: 3,
  points: 4,
  objectID: 0,
 },
 {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1,
 },
 {
  title: 'Typescript',
  url: 'https://typescriptlang.org/',
  author: 'Microsoft',
  num_comments: 5,
  points: 15,
  objectID: 11,
 },

]

const App = () => {

  const getAsyncStories = () => 
    new Promise((resolve) => 
      setTimeout(
        () => resolve({data: {stories: initialStories}}),
        2000
      )
  )

  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'SET_STORIES':
        return action.payload
      case 'REMOVE_STORY':
        return state.filter(
          (story) => action.payload.objectID !== story.objectID
        )
      default:
        throw new Error()
    }
  }

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    )

    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    })

    dispatchStories({
      type: 'SET_STORIES',
      payload: newStories,
    })
  }

  const useStorageState = (key, initialState) => {
    const [value, setValue] = React.useState(
      localStorage.getItem(key) || initialState
    )

    React.useEffect(() => {
      localStorage.setItem(key, value)
    }, [value, key])

    return [value, setValue]
  }

  const [stories, dispatchStories] = React.useReducer(storiesReducer, [])

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React')

  const [isLoading, setIsLoading] = React.useState(false)

  const [isError, setIsError] = React.useState(false)

  React.useEffect(() => {
    setIsLoading(true)

    getAsyncStories()
      .then((result) => {        
        dispatchStories({
          type: 'SET_STORIES',
          payload: result.data.stories,
        })
      setIsLoading(false)
    }).catch(() => setIsError(true))
  }, [])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const searchedStories = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  })

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" value={searchTerm} onInputChange={handleSearch} isFocused>Search:</InputWithLabel>
   
      <hr />

      {isError && <p>Something went wrong ...</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List 
          list={searchedStories} 
          onRemoveItem={handleRemoveStory}
        />
      )}
    </div>
  )  
}

const InputWithLabel = ({id, label, value, type='text', onInputChange, isFocused, children}) => {
  const inputRef = React.useRef()

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }

  }, [isFocused])
  return (
  <>
    <label htmlFor={id}>{children}</label>
    &nbsp;
    <input
      ref={inputRef}
      id={id}
      type={type}
      value={value}
      autoFocus={isFocused}
      onChange={onInputChange}
    />
  </>
  )
}

const Search = ({search, onSearch}) => {
  return (
    <>
      <label key='1' htmlFor='search'>Search: {''} </label>
      <input id='search' type='text' onChange={onSearch} value={search}/>
    </>
  )
}

const List = ({list, onRemoveItem}) => {

  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      ))}
    </ul>
  )
}

const Item = ({item, onRemoveItem}) => {
  const handleRemoveItem = () => {
    onRemoveItem(item)
  }

  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => 
            {onRemoveItem(item)
          }}>
          Dismiss
        </button>
      </span>
    </li>
  )
}

export default App
