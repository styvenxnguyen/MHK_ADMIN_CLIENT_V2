import React, { useState, useEffect, KeyboardEvent, ChangeEvent } from 'react'
import { HiXMark } from 'react-icons/hi2'

interface SelectProps {
  id: string
  name: string
  placeholder: string
  list?: { key: string; values: string[] }[]
  index: number
  onChange: (v: any, index: number, option: string[]) => void
}

const InputTags: React.FC<SelectProps> = ({ onChange, id, name, placeholder, index }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const newOption = inputValue.trim()

      if (selectedOptions.find((item) => item === newOption)) {
        setInputValue('')
      } else {
        const newSelectedOptions = [...selectedOptions, newOption]
        setSelectedOptions(newSelectedOptions)
        onChange(name, index, newSelectedOptions)
        setInputValue('')
      }
    }
  }

  const handleRemove = (option: string) => {
    const newSelectedOptions = selectedOptions.filter((selectedOption) => selectedOption !== option)
    setSelectedOptions(newSelectedOptions)
    onChange(name, index, newSelectedOptions)
  }

  useEffect(() => {
    setInputValue('')
  }, [selectedOptions])

  return (
    <div className='select-container'>
      <span className='tag-list'>
        {selectedOptions.map((option) => (
          <span key={option} className='tag'>
            {option}
            <HiXMark onClick={() => handleRemove(option)} aria-hidden='true' />
          </span>
        ))}
      </span>
      <span className='input-container'>
        <input
          type='text'
          id={id}
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          // style={{ width: selectedOptions.length > 0 ? '' : '300px' }}
        />
      </span>
    </div>
  )
}

export default InputTags
