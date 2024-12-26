import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const CnDbuttons = ({ roomName, setRoomName, joinLink, setJoinLink, handleCreateChatRoom, handleJoinRoom }) => {
  return (
    <div className="fixed bottom-4 right-2 flex flex-col space-y-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Create Room</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Chat Room</DialogTitle>
            <DialogDescription>
              Enter a name for your new chat room.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room Name"
              className="w-full bg-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateChatRoom} disabled={!roomName.trim()}>
              Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Join via Link</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Chat Room</DialogTitle>
            <DialogDescription>
              Enter the Chat Id to join a chat room.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="text"
              value={joinLink}
              onChange={(e) => setJoinLink(e.target.value)}
              placeholder="Invite Link"
              className="w-full bg-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => handleJoinRoom(joinLink)} disabled={!joinLink.trim()} variant="dark">
              Join Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CnDbuttons
