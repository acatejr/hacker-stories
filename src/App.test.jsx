import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, } from '@testing-library/react'
import App, { storiesReducer, Item, List, SearchForm, InputWithLabel } from './App'

const storyOne = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
}

const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
}

const storyThree = {
    title: 'Typescript',
    url: 'https://typescriptlang.org/',
    author: 'Microsoft',
    num_comments: 5,
    points: 15,
    objectID: 11,
}

const stories = [storyOne, storyTwo]

describe('storiesReducer', () => {
    it('removes a story from all stories', () => {
        const action = {type: 'REMOVE_STORY', payload: storyOne}        
        const state = {data: stories, isLoading: false, isError: false}
        const newState = storiesReducer(state, action)
        const expectedState = {
            data: [storyTwo],
            isLoading: false,
            isError: false,
        }
        expect(newState).toStrictEqual(expectedState)
    })
})

describe('something truthy and falsy', () => {
    it('true to be true', () => {
        expect(true).toBeTruthy()
    })

    it('false to be false', () => {
        expect(false).toBeFalsy()
    })
})

describe('Item', () => {
    it('renders all properties', () => {
        render(<Item item={storyOne} />)

        expect(screen.getByText('Jordan Walke')).toBeInTheDocument()
        expect(screen.getByText('React')).toHaveAttribute('href', 'https://reactjs.org/')
        screen.debug()
    })

    it('renders a clickable dismiss button', () => {
        render(<Item item={storyOne} />)
        // expect(screen.getByRole(''))
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('clicking the dismiss button calls the callback handler', () => {
        const handleRemoveItem = vi.fn()
        render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />)
        fireEvent.click(screen.getByRole('button'))
        expect(handleRemoveItem).toHaveBeenCalledTimes(1)
    })
})