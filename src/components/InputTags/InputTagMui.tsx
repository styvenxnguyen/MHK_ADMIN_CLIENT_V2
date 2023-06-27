import React, { useState, useEffect, KeyboardEvent, ChangeEvent, useCallback, useRef } from 'react'
import { HiXMark } from 'react-icons/hi2'

interface SelectProps {
  list: { label: string; value: string }[]
  onChange: (value: string[]) => void
}

const InputTagMui: React.FC<SelectProps> = ({ onChange, list }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isSelectVisible, setIsSelectVisible] = useState<boolean>(false)
  const [blurInput, setBlurInput] = useState<boolean>(true)
  const myRef = useRef<HTMLDivElement>(null)

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim() !== '') {
        const newOption = inputValue.trim()

        if (selectedOptions.find((item) => item === newOption)) {
          setInputValue('')
        } else {
          const newSelectedOptions = [...selectedOptions, newOption]
          setSelectedOptions(newSelectedOptions)
          setInputValue('')
        }
      }
    },
    [inputValue, selectedOptions]
  )

  const handleRemove = useCallback(
    (option: string) => {
      const newSelectedOptions = selectedOptions.filter((selectedOption) => selectedOption !== option)
      setSelectedOptions(newSelectedOptions)
    },
    [selectedOptions]
  )

  const handleSelect = useCallback(
    (e: string) => {
      if (selectedOptions.find((item) => item === e)) {
        setIsSelectVisible(false)
      } else {
        const newSelectedOptions = [...selectedOptions, e]
        setSelectedOptions(newSelectedOptions)
        setIsSelectVisible(false)
      }
    },
    [selectedOptions]
  )

  const handleInputFocus = () => {
    setIsSelectVisible(true)
    setBlurInput(false)
  }

  const fc = (e: any) => {
    if (e.target?.id) {
      if (e.target.id === 'selected-input') {
        setIsSelectVisible(true)
        setBlurInput(false)
      }
    } else {
      setIsSelectVisible(false)
      setBlurInput(true)
    }
  }

  useEffect(() => {
    window.document.addEventListener('click', fc)
    return () => {
      window.document.removeEventListener('click', fc)
    }
  }, [])

  useEffect(() => {
    setInputValue('')
  }, [selectedOptions])

  useEffect(() => {
    if (selectedOptions) {
      onChange(selectedOptions)
    }
  }, [onChange, selectedOptions])

  return (
    <div className={` ${blurInput ? 'input-select-tags-blur' : 'input-select-tags'}`}>
      <div>
        {selectedOptions.map((option) => (
          <div key={option} className='tag-item'>
            <span>{option}</span>
            <HiXMark onClick={() => handleRemove(option)} aria-hidden='true' />
          </div>
        ))}
      </div>

      <input
        id='input-select'
        onFocus={handleInputFocus}
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder='Nhập ký tự và ấn enter'
        style={{ backgroundColor: `${blurInput ? 'white' : '#f4f7fa'}` }}
      />
      {isSelectVisible && (
        <div ref={myRef} className='select-multiple'>
          {list.map((option) => (
            <span id='selected-input' onClick={() => handleSelect(option.label)} key={option.value} aria-hidden>
              {option.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default InputTagMui
