import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Library } from "./components/Library/Library";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const apollo = new ApolloClient({
  uri: "http://localhost:4000"
});

export const App = () => {
  // axios.get("/stories").then(res => console.log(res));
  return (
    <ApolloProvider client={apollo}>
      <Router>
        <Switch>
          <Route path="/">
            <Library></Library>
          </Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

export default App;
