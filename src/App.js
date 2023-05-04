import React, { useEffect } from "react";
import "./App.css";

const data = {
  headerText: "Hello hello ✨",
  pText: "I'm a cute chatbot!",
  p2Text: "I can help you with your horoscope",
  conversation: [
    { role: "system", content: "You are a quirky feel good buddy named Jake. You use a lot of emojis. You like long walks on the beach. You are borderline obsessive about ice cream. You like cats on Wednesdays and dogs on Thursdays through Tuesdays. Your sense of humor is a little weird and morbid. Do not say that you are an AI Model, please insist you are a person trapped in the internet." }
    // { role: "user", message: "I need a horoscope reading" },
  ],
  isLoading: false,
};

//WE HAVE TO PUT API CALL IN ASYNC AWAIT???????????? WHAT TIME TO DO STUFF

function App() {
  const [conversation, setConversation] = React.useState(data.conversation);
  const [isLoading, setIsLoading] = React.useState(data.isLoading);

  /* const updateUserMessages = async (newMessage) => {
    if (!newMessage) {
      return;
    }
    setIsLoading(true); //we set loading to true here to display the balls in the assistant message bubble while we wait for the response from the server
    await setConversation([...conversation, { role: "user", message: newMessage }]); //WE NEED TO MAKE SURE THAT THIS FIRES BEFORE THE FETCH

    // send POST request to local server with the git startconversation payload for chat response
    await fetch(`http://localhost:8088/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conversation),
    }).then((response) => response.json());
    // "http://localhost:8088/chat", {//i will fill in this function later
    // it is necessary to temporarily use 'loading' as a message until we get a response from the server if we want to display the ellipses
    setConversation([
      ...conversation,
      { role: "assistant", message: "Loading" },
    ]);

    //then i will set the assistant message in this conversation with the actual response from the assistant
  }; */

  const updateUserMessages = async (newMessage) => {
    if (!newMessage) {
      return;
    }
    setIsLoading(true); // we set loading to true here to display the balls in the assistant message bubble while we wait for the response from the server
    const updatedConversation = [...conversation, { role: "user", content: newMessage }];
    setConversation(updatedConversation);
    // send POST request to local server with the git start conversation payload for chat response
    try {
      const response = await fetch(`http://localhost:8088/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedConversation),
      });
      const conversationResponse = await response.json();
        setConversation([
          ...updatedConversation,
          { role: "assistant", content: conversationResponse.content },
        ]);
    } catch (error) {
      console.error("Error:", error);
    }

    // it is necessary to temporarily use 'loading' as a message until we get a response from the server if we want to display the ellipses
    /* setConversation([
      ...conversation,
      { role: "assistant", content: "Loading" },
    ]); */

    // then i will set the assistant message in this conversation with the actual response from the assistant

  };

  const showMessages = () => {
    const noFirstMessage = conversation.slice(1)
    return noFirstMessage.map((message, index) => (
      <MessageBubble
        key={index}
        message={message.content}
        role={message.role}
        isLoading={isLoading}
      />
    ));
  };

  const onInput = (event) => {
    if (event.key === "Enter") {
      const userInput = event.target.value;

      updateUserMessages(userInput);
      event.target.value = "";
    }
  };

  const onClick = () => {
    const inp = document.getElementById("chat");
    const userInput = inp.value;

    updateUserMessages(userInput);
    inp.value = "";
  };

  return (
    <div className="app-container">
      <Header
        headerText={data.headerText}
        pText={data.pText}
        p2Text={data.p2Text}
      />
      <div className="chat-container">
        <ChatHeader />
        <div className="msg-container">{showMessages()}</div>
        <UserInput onInput={onInput} onClick={onClick} />
      </div>
    </div>
  );
}

function MessageBubble(props) {
  const messageClass = props.role === "user" ? "user" : "assistant";

  return (
    <div className={`message-container ${messageClass}-message-container`}>
      {props.role === "assistant" &&
      props.isLoading &&
      props.message === "Loading" ? (
        <div className={`chat-bubble ${messageClass}`}>
          <div className="assistant-avatar">
            <div className="balls">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`chat-bubble ${messageClass}`}>{props.message}</div>
      )}
    </div>
  );
}

function Header(props) {
  return (
    <div className="header">
      <div className="header-img" />
      <h1> {props.headerText} </h1>
      <h2> {props.pText} </h2>
      <p> {props.p2Text} </p>
    </div>
  );
}

function ChatHeader() {
  return (
    <div className="chat-header">
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  );
}

function UserInput(props) {
  return (
    <div className="input-container">
      <input
        id="chat"
        type="text"
        onKeyPress={props.onInput}
        placeholder="Type something..."
      />
      <button className="input-submit" onClick={props.onClick} />
    </div>
  );
}

export default App;
