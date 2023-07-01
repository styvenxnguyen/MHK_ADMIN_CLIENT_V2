import React, { useState, useEffect, KeyboardEvent, ChangeEvent, useCallback, useRef } from 'react'
import { HiXMark } from 'react-icons/hi2'
import { TagService } from '~/services/tag.service'

interface SelectProps {
  list: { label: string; value: string }[]
  onChange: (value: string[]) => void
  tagsDetail?: { label: string; value: string }[]
  onChangeNewTags: (value: { tag_title: string; tag_description: string }[]) => void
  position: string
}

const InputTagMui: React.FC<SelectProps> = ({ onChange, list, onChangeNewTags, position, tagsDetail }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [selectedOptionsValue, setSelectedOptionsValue] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isSelectVisible, setIsSelectVisible] = useState<boolean>(false)
  const [blurInput, setBlurInput] = useState<boolean>(true)
  const [listTag, setListTag] = useState<any>([])
  const myRef = useRef<HTMLDivElement>(null)
  const [options, setOptions] = useState<{ label: string; value: string }[]>([])
  const [newTags, setNewTags] = useState<string[]>([])

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
          // const value = [...selectedOptionsValue, newOption]
          const tags = [...newTags, newOption]
          setNewTags(tags)
          setSelectedOptions(newSelectedOptions)
          // setSelectedOptionsValue(value)
          setInputValue('')
        }
      }
    },
    [inputValue, selectedOptions, newTags]
  )

  const handleRemove = useCallback(
    (option: string) => {
      const newSelectedOptions = selectedOptions.filter((selectedOption) => selectedOption !== option)
      const value = selectedOptionsValue.filter(
        (selectedOption) => selectedOption !== listTag.find((e: any) => e.tag_title === option)?.id
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
    setOptions(list)
  }, [list])

  useEffect(() => {
    const arr = newTags.map((e) => ({
      tag_title: e,
      tag_description: 'Nothing'
    }))
    onChangeNewTags(arr)
  }, [newTags, onChangeNewTags])

  useEffect(() => {
    if (selectedOptionsValue) {
      setOptions(list.filter((itemA) => !selectedOptionsValue.some((itemB) => itemB === itemA.value)))
    }
  }, [list, selectedOptionsValue])

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

  useEffect(() => {
    if (tagsDetail) {
      setSelectedOptions(tagsDetail.map((e) => e.label))
      setSelectedOptionsValue(tagsDetail.map((e) => e.value))
    }
  }, [tagsDetail])
  
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
        <div ref={myRef} className={` ${position === 'top' ? 'select-multiple-top' : 'select-multiple-bottom'}`}>
          {options.map((option) => (
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
