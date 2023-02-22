import * as React from 'react'
import axios from 'axios'
import './App.css'

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

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query="

const App = () => {

  const getAsyncStories = () => 
    new Promise((resolve) => 
      setTimeout(
        () => resolve({data: {stories: initialStories}}),
        2000
      )
  )

  // const getAsyncStories = () => new Promise((resolve, reject) => setTimeout(reject, 2000))

  const storiesReducer = (state, action) => {
    switch (action.type) {
      case 'STORIES_FETCH_INIT':
        return {
          ...state,
          isLoading: true,
          isError: false,
        }
      case 'STORIES_FETCH_SUCCESS':
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload
        }
      case 'STORIES_FETCH_FAILURE':
        return {
          ...state,
          isLoading: false,
          isError: true,
        }
      // case 'SET_STORIES':
      //   return action.payload
      case 'REMOVE_STORY':
        return {
          ...state,
          data: state.data.filter(
            (story) => action.payload.objectID !== story.objectID
          ),
        }
        // return state.filter(
        //   (story) => action.payload.objectID !== story.objectID
        // )
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

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer, 
    {data: [], isLoading: false, isError: false} 
  )

  const [searchTerm, setSearchTerm] = useStorageState('search', 'React')

  const [isLoading, setIsLoading] = React.useState(false)

  const [isError, setIsError] = React.useState(false)

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  )

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault()
  }

  const handleFetchStories = React.useCallback(async () => {

    dispatchStories({ type: 'STORIES_FETCH_INIT'})
    
    try {
      const result = await axios.get(url)
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      })
    } catch {
      dispatchStories({type: 'STORIES_FETCH_FAILURE'})
    }

    }, [url])

  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const searchedStories = stories.data.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className='container'>
      <h1 className='headline-primary'>My Hacker Stories</h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List 
          list={stories.data} 
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
    <label htmlFor={id} className='label'>{children}</label>
    &nbsp;
    <input
      ref={inputRef}
      id={id}
      type={type}
      value={value}
      autoFocus={isFocused}
      onChange={onInputChange}
      className='input'
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
    <li className='item'>
      <span style={{width: '40%'}}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{width: '30%'}}>{item.author}</span>
      <span style={{width: '10%' }}>{item.num_comments}</span>
      <span style={{width: '10%' }}>{item.points}</span>
      <span style={{width: '10%'}}>
        <button type="button" onClick={() => {onRemoveItem(item)}} className='button button_small'>
          Dismiss
        </button>
      </span>
    </li>
  )
}

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit={onSearchSubmit} className='search-form'>
      <InputWithLabel 
          id="search" 
          value={searchTerm} 
          isFocused
          onInputChange={onSearchInput}
        >
          <strong>Search:</strong>
      </InputWithLabel>

      <button type="submit" disabled={!searchTerm} className='button button_large'>
        Submit
      </button>
  </form>
)

export default App
