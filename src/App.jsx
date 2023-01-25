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

  const handleSearch = (event) => {
    console.log(event.target.value)
  }

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search onSearch={handleSearch}/>
      <hr />
      <List list={stories}/>
    </div>
  )  
}


const Search = (props) => {
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
    props.onSearch(event)
  }

  return (
    <div>
      <label htmlFor='seach'>Search: </label>
      <input id='search' type='text' onChange={handleChange}/>
      <p>Searching for <strong>{searchTerm}</strong></p>
    </div>
  )
}

const List = (props) => {

  return (
    <ul>
      {props.list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  )
}

const Item = (props) => {
  return (
    <li>
      <span>
        <a href={props.item.url}>{props.item.title}</a>
      </span>
      <span>{props.item.author}</span>
      <span>{props.item.num_comments}</span>
      <span>{props.item.points}</span>

    </li>
  )
}
export default App
