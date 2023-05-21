import React, { useState, useEffect } from 'react'

import friend from './Chat/friends'
import Friend from '.'
import Chat from './Chat'

const Friends = ({ listOpen }: any) => {
  const [chatOpen, setChatOpen] = useState(listOpen)
  const [user, setUser]: any = useState([])

  useEffect(() => {
    setChatOpen(false)
  }, [listOpen])

  const friendList = friend.map((f) => {
    return (
      <Friend
        key={f.id}
        data={f}
        activeId={user.id}
        clicked={() => {
          setChatOpen(true)
          setUser(f)
        }}
      />
    )
  })

  return (
    <React.Fragment>
      {friendList}
      <Chat
        user={user}
        chatOpen={chatOpen}
        listOpen={listOpen}
        closed={() => {
          setChatOpen(false)
          setUser([])
        }}
      />
    </React.Fragment>
  )
}

export default Friends
