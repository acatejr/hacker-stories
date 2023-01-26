import * as React from 'react'

const welcome = {
  greeting: 'Hey',
  title: 'React'
}

function getTitle(title) {
  return title
}

const stories = [
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
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const searchedStores = stories.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  })

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search onSearch={handleSearch} search={searchTerm}/>
      <hr />
      <List list={searchedStores}/>
    </div>
  )  
}


const Search = ({search, onSearch}) => {
  return (
    <div>
      <label htmlFor='seach'>Search: </label>
      <input id='search' type='text' onChange={onSearch} value={search}/>
    </div>
  )
}

const List = ({list}) => {

  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  )
}

const Item = ({item}) => {
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
    </li>
  )
}

export default App
