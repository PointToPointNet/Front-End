import { useState } from 'react';

import ChatbotChatting from './Chatbot-chatting';
import style from '../styles/chatbot.module.scss';

import { TbMessageChatbotFilled } from "react-icons/tb";

const ChatBot = () => {
    const [usingChatting, setUsingChatting] = useState<boolean>(false);
    return (
        <>
            <div className={style.chatBotArea} onClick={() => { setUsingChatting(!usingChatting) }}>
                <TbMessageChatbotFilled className={style.chatBotIcon} size="60" />
            </div>
            {usingChatting ? <ChatbotChatting setUsingChatting={setUsingChatting}></ChatbotChatting> : null}
        </>

    );
}

export default ChatBot;