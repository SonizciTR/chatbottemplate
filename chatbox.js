function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))))
      .toString(16)
      .replace("-", "")
  );
}

const url_backend_base = "http://localhost:50689/";
const cUserUniqueId = uuidv4();

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

const getRequest = (propsInfo) => {
  return {
    channel: propsInfo.channel,
    userUniqueId: cUserUniqueId,
  };
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
  if (body) req.send(JSON.stringify(body));
  else req.send(body);
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
    var channelVal = this.props.myinput;
    callBackendPost(
      "chatconfig",
      (data) => this.setConfig(data),
      getRequest(this.props)
    );
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
    console.log("ChatRoot.State durumu:", this.state);
    console.log("ChatRoot.Props durumu:", this.props);
    if (this.state.isOpened) {
      return (
        <>
          <ChatWindow
            Configs={this.state.configs}
            ClickMinize={this.toggleChatWindow}
          />
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

////////////////////////////////////////////////
const styleMainContainer = {
  // display: "flex",
  // "flex-direction": "column",
  width: "100%",
  height: "100%",
};

const styleChildTopPart = {
  backgroundColor: "red",
  //margin: "auto",
  width: "100%",
  height: "30px",
};

const styleChildMiddlePart = {
  backgroundColor: "green",
  //margin: "auto",
  width: "100%",
  height: "100%",
};

const styleChildBottomPart = {
  backgroundColor: "grey",
  //margin: "auto",
  bottom: "10px",
  width: "100%",
  height: "100px",
};

const styleDivCommon = {
  width: "100%",
  height: "100%",
};

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log("ChatWindow.State durumu:", this.state);
    console.log("ChatWindow.Props durumu:", this.props);
    return (
      <div style={this.props.Configs.styleMaximized}>
        <table style={styleMainContainer}>
          <tr style={styleChildTopPart}>
            <td>
              <ChatWindowTopPart
                Configs={this.props.Configs}
                ClickMinize={this.props.ClickMinize}
              />
            </td>
          </tr>
          <tr style={styleChildMiddlePart}>
            <td>
              <div id="middlePart" style={styleDivCommon}>
                <h1>Middle Part</h1>
              </div>
            </td>
          </tr>
          <tr style={styleChildBottomPart}>
            <td>
              <div id="bottomPart" style={styleDivCommon}>
                <h1>Bottom Part</h1>
              </div>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

/////////////////////////////////////////////////////////
const styleTopImg = {
  width: "24px",
  height: "24px",
  position: "absolute",
  top: "6px",
  right: "10px",
  cursor: "pointer",
};
class ChatWindowTopPart extends React.Component {
  constructor(props) {
    super(props);
  }
  /////

  render() {
    return (
      <div>
        <span>{this.props.Configs.textHeader}</span>
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAABd1JREFUeJzt3cFuDlEUwPGzUwl2koqdpHaaeBhaj9MNSWNdVD2MDSIWEm+gscASCbXgnswDIPjOmZnfL/m/wNnc+b57504EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADUuDS6M3o8ejn6MDob/ZAkaYXlGphrYa6Jx6P90cVYkOujJ6MvUT9sSZI6l2vlyWgnZuz86P7oe9QPVJKkOZX/DhyOtmJm8snlTdQPUJKkOfd8dCVm4mZMexrVQ5MkaQmdjnajufzlb/GXJOnflg8B29FU7lO8jvohSZK0xF7FdL6unTzwVz0cSZKW3EE0k6/6Oe0vSdL/7VM02wrI9/yrhyJJ0ho6iibyhj+X/EiStJk+R5MbA/N63+phSJK0pvaigbzbv3oQkiStqUfRQH7EoHoQkiStqbwhsNzHqB+EJElr6n008C3qByFJ0pr6Gg14AJAkabO1eACwBSBJ0mZrsQXgEKAkSZutxSHA46gfhCRJa+phNLAf9YOQJGlN3YoGLsR0LWH1MCRJWkO55uba28JJ1A9EkqQ1lFvvbeyMzqJ+KJIkLbl89f5aNHMY9YORJGnJ3YuGtmJ6LaF6OJIkLbFno3PR1PbobdQPSZKkJfVudDWa2x2dRv2wJElaQvnD+kbMxOXR06gfmiRJcy7/9s9/12cl9ykOwh0BkiT9aXna/2403vP/HfnkchQeBCRJ+lW5Vj6Khq/6/Y28tWgvpvuLX8T0JSOfEpYkrbVcA3MtzDXxweh2NLrhDwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAdfkJKH/qkqc9UMUAAAAASUVORK5CYII="
          alt="Minimize"
          style={styleTopImg}
          onClick={this.props.ClickMinize}
        />
      </div>
    );
  }
}

// class MyComponent extends React.Component {
//   render() {
//     return <div>This is a simple component</div>;
//   }
// }
