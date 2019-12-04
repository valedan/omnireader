import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Library } from "./components/Library/Library";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { Reader } from "./components/Reader/Reader";
import { Story } from "./components/Library/Story";
import { theme } from "./theme";
import { ThemeProvider } from "@material-ui/styles";

const apollo = new ApolloClient({
  uri: "http://localhost:4000"
});

export const App = () => {
  return (
    <ApolloProvider client={apollo}>
      <Router>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route path="/chapter/:id">
              <Reader />
            </Route>
            <Route path="/story/:id">
              <Story />
            </Route>
            <Route path="/">
              <Library></Library>
            </Route>
          </Switch>
        </ThemeProvider>
      </Router>
    </ApolloProvider>
  );
};

export default App;
