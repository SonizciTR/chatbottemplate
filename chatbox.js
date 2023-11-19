const url_backend = "https://dog.ceo/api/breeds/list/all";

const chatboxminimized = {
  backgroundColor: "purple",
  position: "absolute",
  bottom: "10px",
  right: "8px",
  width: "64px",
  height: "64px",
};

const chatboxopened = {
  backgroundColor: "yellow",
  position: "absolute",
  bottom: "10px",
  right: "8px",
  width: "25%",
  height: "95%",
};

class BaseChat extends React.Component {
  constructor(props) {
    super(props);
  }

  callBackend(url_to_call, callback_func) {
    var req = new XMLHttpRequest();
    req.open("GET", url_to_call);
    req.onreadystatechange = function (aEvt) {
      if (req.readyState == 4) {
        if (req.status == 200) {
          console.log("callBackend.web cagrisi =>", req.responseText);
          console.log("callBackend.web callback_func =>", callback_func);

          callback_func(JSON.parse(req.responseText));
        } else alert("Error loading page\n");
      }
    };
    req.send();

    //var xhr = new XMLHttpRequest();
    // xhr.addEventListener("load", () => {
    //   console.log("callBackend.web cagrisi =>", xhr.responseText);

    //   callback_func(JSON.parse(xhr.responseText));
    // });
    // xhr.open("GET", url_to_call);
    // xhr.send();
  }
}

////////////////////////////////////////////////

class ChatRoot extends BaseChat {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      configs: {},
    };
  }

  componentDidMount() {
    //this.getData();
    this.callBackend(url_backend, (data) => this.setConfig(data));
  }
  ////////////////////////////////////////////////

  setConfig(configData) {
    console.log("**** setConfig tetiklendi", configData);
    this.setState((state) => ({
      configs: configData,
    }));
  }

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
          <ChatWindow Configs={chatboxopened} />
        </>
      );
    }
    return (
      <>
        <img
          src="chaticon.png"
          alt="Want to chat"
          style={chatboxminimized}
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
    return <div style={this.props.Configs}>Chat Window</div>;
  }
}

// class MyComponent extends React.Component {
//   render() {
//     return <div>This is a simple component</div>;
//   }
// }
