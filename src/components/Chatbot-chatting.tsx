import { useEffect, useState } from "react";
import style from "../styles/chatbot-chatting.module.scss";
import url from "../assets/config/url.ts";

import { IoSend } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";

interface ChatbotChatting {
    setUsingChatting: (argument: boolean) => void;
}

const ChatbotChatting: React.FC<ChatbotChatting> = ({ setUsingChatting }) => {
    const [question, setQuestion] = useState<string>("");
    const [chatting, setChatting] = useState<{ [key: string]: string }[]>([]);
    const [chattingTSX, setChattingTSX] = useState<React.ReactElement[]>([]);

    const questionToBot = async () => {
        if (question !== "") {
            setChatting((prevChat) => [...prevChat, { role: "user", content: question }]);
            setQuestion("");

            const response = await fetch(`${url.url}/chat_bot`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "question": question }),
            });
            const answer = await response.json();

            if (answer) {
                const { role, content } = answer;
                setChatting((prevChat) => [...prevChat, { "role": role, "content": content }]);
            }
        }
    }

    useEffect(() => {
        if (chatting.length > 0) {
            const tsx = chatting.map((chat, index) => {
                const { role, content } = chat;
                return (
                    <div key={index} className={`${style.chatLine} ${role === "user" ? style.userLine : style.assistantLine}`}>
                        <div className={`${style.chatBox} ${role === "user" ? style.userChat : style.assistantChat}`}>
                            <p>{content}</p>
                        </div>
                    </div>
                );
            });

            // console.log(tsx);
            setChattingTSX(tsx);
        }
    }, [chatting])

    return (
        <div className={style.chattingRoom}>
            <div className={style.titleArea}>
                <button className={style.closeButton} onClick={() => { setUsingChatting(false) }}>
                    <IoIosCloseCircle className={style.closeIcon} size="30" />
                </button>
            </div>
            <div className={style.chattingArea}>
                {/* 채팅 공간 */}
                {chattingTSX}
            </div>
            <div className={style.promptArea}>
                <textarea value={question} className={style.prompt}
                    onChange={(e) => { setQuestion(e.target.value); }} onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            questionToBot();
                        }
                    }}></textarea>
                <button className={style.sendButton} onClick={() => { questionToBot(); }}>
                    <IoSend />
                </button>
            </div>

        </div>
    );
}

export default ChatbotChatting;