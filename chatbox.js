const url_backend = "https://dog.ceo/api/breeds/list/all";

const chatboxmerged = {
  backgroundColor: "purple",
  position: "absolute",
  bottom: "10px",
  right: "8px",
  width: "64px",
  height: "64px",
};

////////////////////////////////////////////////

class ChatRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      configs: {},
    };
  }

  componentDidMount() {
    // call api or anything
    console.log("ChatBox.componentDidMount has been rendered");

    this.getData();
  }
  ////////////////////////////////////////////////

  getData() {
    // create a new XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // get a callback when the server responds
    xhr.addEventListener("load", () => {
      // update the state of the component with the result here
      console.log("web cagrisi:", xhr.responseText);

      this.setState((state) => ({
        configs: JSON.parse(xhr.responseText),
      }));
    });
    // open the request with the verb and the url
    xhr.open("GET", url_backend);
    // send the request
    xhr.send();
  }

  toggleChatWindow = () => {
    this.setState((state) => ({
      isOpened: !state.isOpened,
    }));
    console.log("toggleChatWindow Clicked : ", this.state);
  };

  render() {
    console.log("ChatBox.State durumu:", this.state);
    console.log("ChatBox.Props durumu:", this.props);
    if (this.state.isOpened) {
      return (
        <>
          <ChatWindow />
        </>
      );
    }
    return (
      <>
        <img
          src="chaticon.png"
          alt="Want to chat"
          style={chatboxmerged}
          onClick={this.toggleChatWindow}
        />
      </>
    );
  }
}

class ChatWindow extends React.Component {
  render() {
    console.log("ChatWindow.State durumu:", this.state);
    console.log("ChatWindow.Props durumu:", this.props);
    return <h1>Chat Window</h1>;
  }
}

// class MyComponent extends React.Component {
//   render() {
//     return <div>This is a simple component</div>;
//   }
// }
