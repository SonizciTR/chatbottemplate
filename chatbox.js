const url_backend_base = "http://localhost:50689/";

function uuidv4() {
  var rslt = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
  return rslt.replaceAll("-", "");
}

const cUserUniqueId = uuidv4();

const chatboxminimized = {
  backgroundColor: "purple",
  borderRadius: "10px",
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
    requestId: uuidv4(),
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
        let jsn = JSON.parse(req.responseText);
        console.log("-Response Body =>", jsn);
        callback_func(jsn);
      } else alert("Error loading page\n");
    }
  };
  console.log("-Request Body =>", body);
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
    this.setState((state) => ({
      configs: configData,
    }));
  }

  toggleChatWindow = () => {
    this.setState((state) => ({
      isOpened: !state.isOpened,
    }));
  };

  render() {
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
  //backgroundColor: "red",
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
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgDQoJIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDQ4MC4yMjEgNDgwLjIyMSINCgkgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBkPSJNNDgwLjE1OCwyNjAuODc4djE2Ni45NzljMCwyOC44NzQtMjMuNTAxLDUyLjM2My01Mi4zODEsNTIuMzYzSDUyLjQ1M2MtMjguODg5LDAtNTIuMzktMjMuNDg5LTUyLjM5LTUyLjM2M1Y1Mi45MzgNCgkJYzAtMjguODc0LDIzLjUwMS01Mi4zNjksNTIuMzktNTIuMzY5aDE2Ny40MzRjLTkuMDExLDkuMjQ0LTE1LjAwNCwyMS40NS0xNi4zMTYsMzUuMDAzSDUyLjQ0Nw0KCQljLTkuNTgyLDAtMTcuMzc4LDcuNzkxLTE3LjM3OCwxNy4zNjZ2Mzc0LjkyYzAsOS41NjksNy43OTYsMTcuMzYsMTcuMzc4LDE3LjM2aDM3NS4zMjVjOS41ODEsMCwxNy4zNzItNy43OTEsMTcuMzcyLTE3LjM2VjI3Ny4xNjkNCgkJQzQ1OC4zMywyNzUuOTA0LDQ3MC41NiwyNzAuMjM2LDQ4MC4xNTgsMjYwLjg3OHogTTM5OS4yODcsMjMwLjA5NkgyODQuODMxTDQ3MC4wOTksNDQuODI5YzEwLjI0OS0xMC4yNjEsMTAuMjQ5LTI2Ljg4MiwwLTM3LjEzMQ0KCQljLTEwLjI1Ni0xMC4yNjEtMjYuODgzLTEwLjI2MS0zNy4xMzItMC4wMTJMMjQ3LjcsMTkyLjk1OFY3OC40OTdjMC0xNC40OTktMTEuNzU3LTI2LjI2Mi0yNi4yNTktMjYuMjYyDQoJCWMtNy4yNSwwLTEzLjgxNiwyLjkzMi0xOC41NjksNy42ODljLTQuNzUyLDQuNzY1LTcuNjkzLDExLjMyNS03LjY5MywxOC41NzJ2MTc3Ljg1NGMwLDE0LjQ5OSwxMS43NTQsMjYuMjU2LDI2LjI1NiwyNi4yNTZoMTc3Ljg1Mg0KCQljMTQuNTA1LDAsMjYuMjU2LTExLjc1MSwyNi4yNTYtMjYuMjU2UzQxMy43OTIsMjMwLjA5NiwzOTkuMjg3LDIzMC4wOTZ6Ii8+DQo8L2c+DQo8L3N2Zz4="
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
