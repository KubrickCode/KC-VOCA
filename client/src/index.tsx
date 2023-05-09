import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./Style/globalstyle.css";
import App from "./components/App";
import ReactQueryProvider from "./ReactQuery/ReactQueryProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// root 엘리먼트에 <BrowserRouter>와 <App> 컴포넌트를 렌더링합니다.
root.render(
  <BrowserRouter>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
