import React, { useState, useEffect, KeyboardEvent, ChangeEvent, useCallback, useRef } from 'react'
import { HiXMark } from 'react-icons/hi2'
import { TagService } from '~/services/tag.service'

interface SelectProps {
  list: { label: string; value: string }[]
  onChange: (value: string[]) => void
}

const InputTagMui: React.FC<SelectProps> = ({ onChange, list }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [selectedOptionsValue, setSelectedOptionsValue] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isSelectVisible, setIsSelectVisible] = useState<boolean>(false)
  const [blurInput, setBlurInput] = useState<boolean>(true)
  const [listTag, setListTag] = useState<any>([])
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
          const value = [...selectedOptionsValue, newOption]
          setSelectedOptions(newSelectedOptions)
          setSelectedOptionsValue(value)
          setInputValue('')
        }
      }
    },
    [inputValue, selectedOptions, selectedOptionsValue]
  )

  const handleRemove = useCallback(
    (option: string) => {
      const newSelectedOptions = selectedOptions.filter((selectedOption) => selectedOption !== option)
      const value = selectedOptionsValue.filter(
        (selectedOption) => selectedOption !== listTag.find((e: any) => e.tag_title === option).id
      )
      setSelectedOptions(newSelectedOptions)
      setSelectedOptionsValue(value)
    },
    [selectedOptions, listTag, selectedOptionsValue]
  )

  const handleSelect = useCallback(
    (e: string, v: string) => {
      if (selectedOptions.find((item) => item === e)) {
        setIsSelectVisible(false)
      } else {
        const newSelectedOptions = [...selectedOptions, e]
        const value = [...selectedOptionsValue, v]
        setSelectedOptions(newSelectedOptions)
        setSelectedOptionsValue(value)
        setIsSelectVisible(false)
      }
    },
    [selectedOptions, selectedOptionsValue]
  )

  const getListTags = useCallback(async () => {
    try {
      const res = await TagService.getListTag()
      setListTag(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

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
    if (selectedOptionsValue) {
      onChange(selectedOptionsValue)
    }
  }, [onChange, selectedOptionsValue])

  useEffect(() => {
    getListTags()
  }, [getListTags])

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
            <span
              id='selected-input'
              onClick={() => handleSelect(option.label, option.value)}
              key={option.value}
              aria-hidden
            >
              {option.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default InputTagMui
