import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {

  const [messages,setMessages] = useState([]);
  const [users,setUsers] = useState([]);
  const [selectedUser,setSelectedUser] = useState(null);
  const [unseenMessages,setUnseenMessages] = useState({});

  const {socket,axios} = useContext(AuthContext);

  const getUsers = async() => {
    try {
      const { data } = await axios.get('/api/message/users',{withCredentials:true});
      if(data.success)
      {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const getMessages = async(userId) => {
    try {
      const { data } = await axios.get(`/api/message/users/${userId}`,{withCredentials:true});
      console.log(data)
      if(data.success)
      {
        setMessages(data.messages)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const sendMessage = async(messageData) => {
    try {
      const { data } = await axios.post(`/api/message/send/${selectedUser._id}`,messageData,{withCredentials:true});
      if(data.success)
      {
        setMessages((prevMessages)=> [...prevMessages,data.newMessage]);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const subscribeToMessages = async() => {
    if(!socket) return;
    socket.on("newMessage", (newMessage)=>{
        if(selectedUser && newMessage.senderId === selectedUser._id){
            newMessage.seen = true;
            setMessages((prevMessages)=> [...prevMessages, newMessage]);
            axios.put(`/api/messages/mark/${newMessage._id}`);
        }else{
          setUnseenMessages((prevUnseenMessages)=>({
              ...prevUnseenMessages, [newMessage.senderId] : 
              prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
          }))
        }
    })
  }

  const unsubscribeFromMessage = async() => {
    if(socket) socket.off("newMessage");
  }

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessage();
  },[socket,selectedUser]);

  const value = {
    messages,users,selectedUser,getUsers,setMessages,getMessages,sendMessage,setSelectedUser,unseenMessages,setUnseenMessages
  }

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  )
}

