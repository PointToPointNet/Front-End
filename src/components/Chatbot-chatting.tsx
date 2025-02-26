import { useState } from "react";

const ChatbotChatting = () => {
    const [question, setQuestion] = useState<string>("");

    return (
        <div >
            <div>
                {/* 채팅 공간 */}
            </div>
            <div>
                <input type="text" onChange={(e) => { setQuestion(e.target.value); console.log(question) }}></input>
                <button>전송</button>
            </div>

        </div>
    );
}

export default ChatbotChatting;