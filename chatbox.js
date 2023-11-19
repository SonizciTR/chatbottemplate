const url_backend_base = "http://localhost:50689/";

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

const callBackendPost = (url_to_call, callback_func, body = "") => {
  var full_url = url_backend_base + url_to_call;
  var req = new XMLHttpRequest();

  req.open("POST", full_url);
  req.setRequestHeader("Content-type", "application/json");
  req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  req.setRequestHeader("Access-Control-Allow-Origin", "*");

  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        console.log("callBackend.web cagrisi =>", req.responseText);
        console.log("callBackend.web callback_func =>", callback_func);

        callback_func(JSON.parse(req.responseText));
      } else alert("Error loading page\n");
    }
  };
  console.log("body =>", body);
  req.send(body);
};

////////////////////////////////////////////////

class ChatRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      configs: {
        styleMinimized: chatboxminimized,
        styleMaximized: chatboxopened,
      },
    };
  }

  componentDidMount() {
    //this.getData();
    var channelVal = this.props.myinput;
    callBackendPost("chatconfig", (data) => this.setConfig(data), {
      channel: channelVal,
    });
  }
  ////////////////////////////////////////////////

  setConfig(configData) {
    console.log("**** setConfig tetiklendi", configData);
    this.setState((state) => ({
      configs: configData,
    }));
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
          <ChatWindow Configs={this.state.configs} />
        </>
      );
    }
    return (
      <>
        <img
          src="chaticon.png"
          alt="Want to chat"
          style={this.state.configs.styleMinimized}
          onClick={this.toggleChatWindow}
        />
      </>
    );
  }
}

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("ChatWindow.State durumu:", this.state);
    console.log("ChatWindow.Props durumu:", this.props);
    return (
      <div style={this.props.Configs.styleMaximized}>
        <div id="topPart">
          <h1>Top Part</h1>
        </div>
        <div id="middlePart">
          <h1>Middle Part</h1>
        </div>
        <div id="bottomPart">
          <h1>Bottom Part</h1>
        </div>
      </div>
    );
  }
}

// class MyComponent extends React.Component {
//   render() {
//     return <div>This is a simple component</div>;
//   }
// }
