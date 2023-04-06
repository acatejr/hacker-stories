import * as React from 'react'
import axios from 'axios'
import { sortBy } from 'lodash'
import { SearchForm } from './SearchForm'
import { List } from './List'

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const useStorageState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, 'title'),
  AUTHOR: (list) => sortBy(list, 'author'),
  COMMENT: (list) => sortBy(list, 'num_comments').reverse(),
  POINT: (list) => sortBy(list, 'points').reverse(),
}

const extractSearchTerm = (url) => url.replace(API_ENDPOINT, '')
// const getLastSearches = (urls) => urls.slice(-6).slice(0, -1).map(extractSearchTerm)
const getLastSearches = (urls) => 
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url)

      if (index === 0) {
        return result.concat(searchTerm)
      }

      const previousSearchTerm = result[result.length - 1]

      if (searchTerm === previousSearchTerm) {
        return result
      } else {
        return result.concat(searchTerm)
      }
    }, [])
    .slice(-6).slice(0, -1)

const getUrl = (searchTerm) => `${API_ENDPOINT}${searchTerm}`

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState(
    'search',
    'React'
  );

  const [urls, setUrls] = React.useState(
    [getUrl(searchTerm)]
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const handleSearch = (searchTerm) => {
    const url = getUrl(searchTerm)
    setUrls(urls.concat(url))
  }

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const lastUrl = urls[urls.length - 1]
      const result = await axios.get(lastUrl);

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [urls]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleSearchSubmit = (event) => {
    handleSearchTerm(searchTerm)
    event.preventDefault()
  }

  const lastSearches = getLastSearches(urls)

  const handleLastSearch = (searchTerm) => {
    handleSearchTerm(searchTerm)
  }
  
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <LastSearches lastSearches={lastSearches} onLastSearch={handleLastSearch} />
      
      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  )
}

const LastSearches = ({ lastSearches, onLastSearch }) => {
  <>
     {lastSearches.map((searchTerm, index) => (
       <button key={searchTerm + index} type='button' onClick={() => onLastSearch(searchTerm)}>
        {searchTerm}
      </button>
     ))}
  </>
}

export default App
export {SORTS}
// export { storiesReducer, SearchForm, InputWithLabel, List, Item };
