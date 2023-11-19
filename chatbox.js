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
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGhlaWdodD0iODAwcHgiIHdpZHRoPSI4MDBweCIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDU4IDU4IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMzkxRkQ7IiBkPSJNMjUsOS41ODZDMTEuMTkzLDkuNTg2LDAsMTkuNjIxLDAsMzJjMCw0LjU2MiwxLjUyNCw4LjgwMyw0LjEzNSwxMi4zNDMNCgkJQzMuNzkyLDQ4LjQzMywyLjgwNSw1NC4xOTQsMCw1N2MwLDAsOC40Ny0xLjE5MSwxNC4yNzMtNC42NTFjMC4wMDYtMC4wMDQsMC4wMDktMC4wMSwwLjAxNC0wLjAxMw0KCQljMS43OTQtMS4xMDYsMy44MDktMi4zOTcsNC4zMDItMi43ODNjMC4zMDEtMC40MTcsMC44NzktMC41NDMsMS4zMjgtMC4yNzFjMC4yOTgsMC4xODEsMC40ODcsMC41MTIsMC40ODgsMC44Ng0KCQljMC4wMDMsMC41ODItMC4wMDgsMC43NDQtMy42NTEsMy4wMThjMi41ODIsMC44MSw1LjM1NSwxLjI1NCw4LjI0NSwxLjI1NGMxMy44MDcsMCwyNS0xMC4wMzUsMjUtMjIuNDE0UzM4LjgwNyw5LjU4NiwyNSw5LjU4NnoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojMEY3MUQzOyIgZD0iTTU4LDIzLjQxNEM1OCwxMS4wMzUsNDYuODA3LDEsMzMsMWMtOS45NywwLTE4LjU3NSw1LjIzNC0yMi41ODksMTIuODA0DQoJCUMxNC41MTgsMTEuMTUzLDE5LjU1Myw5LjU4NiwyNSw5LjU4NmMxMy44MDcsMCwyNSwxMC4wMzUsMjUsMjIuNDE0YzAsNC43MzUtMS42NDIsOS4xMjQtNC40MzcsMTIuNzQzDQoJCUM1MS4xNjIsNDcuNDQ4LDU4LDQ4LjQxNCw1OCw0OC40MTRjLTIuODA1LTIuODA1LTMuNzkyLTguNTY2LTQuMTM1LTEyLjY1N0M1Ni40NzYsMzIuMjE3LDU4LDI3Ljk3Niw1OCwyMy40MTR6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zMi41LDI2aC0xNGMtMC41NTIsMC0xLTAuNDQ3LTEtMXMwLjQ0OC0xLDEtMWgxNGMwLjU1MiwwLDEsMC40NDcsMSwxUzMzLjA1MiwyNiwzMi41LDI2eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMzgsMzNIMTNjLTAuNTUyLDAtMS0wLjQ0Ny0xLTFzMC40NDgtMSwxLTFoMjVjMC41NTIsMCwxLDAuNDQ3LDEsMVMzOC41NTIsMzMsMzgsMzN6Ii8+DQoJPHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0zOCw0MEgxM2MtMC41NTIsMC0xLTAuNDQ3LTEtMXMwLjQ0OC0xLDEtMWgyNWMwLjU1MiwwLDEsMC40NDcsMSwxUzM4LjU1Miw0MCwzOCw0MHoiLz4NCjwvZz4NCjwvc3ZnPg=="
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
