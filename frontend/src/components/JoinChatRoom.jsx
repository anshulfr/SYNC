import React, { useEffect } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useParams, useNavigate } from 'react-router-dom'

const JOIN_CHAT_ROOM_BY_LINK = gql`
  mutation JoinChatRoomByLink($joinLink: String!, $userId: ID!) {
    joinChatRoomByLink(joinLink: $joinLink, userId: $userId) {
      id
      name
      participants {
        id
        username
      }
    }
  }
`

const JoinChatRoom = () => {
  const { joinLink } = useParams()
  const userId = localStorage.getItem('userId') // Get user ID from local storage
  const [joinChatRoomByLink] = useMutation(JOIN_CHAT_ROOM_BY_LINK)
  const navigate = useNavigate()

  useEffect(() => {
    const joinChatRoom = async () => {
      try {
        const response = await joinChatRoomByLink({ variables: { joinLink, userId } })
        const chatRoomId = response.data.joinChatRoomByLink.id
        navigate(`/chat-room/${chatRoomId}`)
      } catch (error) {
        console.error('Error joining chat room:', error.message)
      }
    }

    joinChatRoom()
  }, [joinLink, userId, joinChatRoomByLink, navigate])

  return <p>Joining chat room...</p>
}

export default JoinChatRoom