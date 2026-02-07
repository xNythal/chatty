import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useAuthStore } from './useAuthStore'

interface ChatState {
  messages: any[]
  users: any[]
  selectedUser: any | null
  isUsersLoading: boolean
  isMessagesLoading: boolean
  getMessages: (userID: string) => Promise<any>
  getUsers: () => Promise<any>
  setSelectedUser: (user: any) => any
  sendMessage: (data: any) => Promise<any>
  subscribeToMessages: () => any
  unsubscribeFromMessages: () => any
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  async getUsers() {
    set({ isUsersLoading: true })
    try {
      const res = await axiosInstance('/messages/users')
      set({ users: res.data })
    } catch (error) {
      if (!axios.isAxiosError(error))
        return toast.error('Something went wrong!')
      toast.error(error.response?.data.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },
  async getMessages(userID: string) {
    set({ isMessagesLoading: true })
    try {
      const res = await axiosInstance(`/messages/${userID}`)
      set({ messages: res.data })
    } catch (error) {
      if (!axios.isAxiosError(error))
        return toast.error('Something went wrong!')
      toast.error(error.response?.data.message)
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  subscribeToMessages() {
    const { selectedUser } = get()
    if (!selectedUser) return
    const { socket } = useAuthStore.getState()
    socket?.on('newMessage', (newMessage) => {
      if (newMessage.senderID !== selectedUser._id) return
      set({
        messages: [...get().messages, newMessage],
      })
    })
  },

  unsubscribeFromMessages() {
    const { socket } = useAuthStore.getState()
    socket?.off('newMessage')
  },

  setSelectedUser(user: any) {
    set({ selectedUser: user })
  },
  async sendMessage(data) {
    const { selectedUser, messages } = get()
    try {
      const res = await axiosInstance.post(
        `/messages/${selectedUser._id}`,
        data,
      )
      set({ messages: [...messages, res.data] })
    } catch (error) {
      if (!axios.isAxiosError(error))
        return toast.error('Something went wrong!')
      toast.error(error.response?.data.message)
    }
  },
}))
