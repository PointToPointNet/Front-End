import { useEffect, useState } from "react";
import style from "../styles/chatbot-chatting.module.scss";
import url from "../assets/config/url.ts";

const ChatbotChatting = () => {
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
            const tsx = chatting.map((chat) => {
                const { role, content } = chat;
                return (
                    <div className={role === "user" ? style.userChat : style.assistantChat}>
                        <p>{role} : {content}</p>
                    </div>
                );
            });

            console.log(tsx);
            setChattingTSX(tsx);
        }
    }, [chatting])

    return (
        <div className={style.chattingRoom}>
            <div className={style.chattingArea}>
                {/* 채팅 공간 */}
                {chattingTSX}
            </div>
            <div className={style.promptArea}>
                <textarea value={question} onChange={(e) => { setQuestion(e.target.value.trim()); }} onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        questionToBot();
                    }
                }}></textarea>
                <button onClick={() => { questionToBot(); }}>전송</button>
            </div>

        </div>
    );
}

export default ChatbotChatting;