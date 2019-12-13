import { createMuiTheme } from "@material-ui/core";
import grey from "@material-ui/core/colors/grey";
import lightBlue from "@material-ui/core/colors/lightBlue";

export const setBaseThemeVariables = () => {
  set("--main-font", "Merriweather");
};

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#fff",
      main: "#fff",
      dark: grey[400]
    },
    secondary: {
      light: lightBlue[100],
      main: lightBlue[500],
      dark: lightBlue[800]
    },
    text: {
      primary: grey[900],
      secondary: grey[500],
      disabled: grey[300],
      hint: lightBlue[500]
    },
    background: {
      paper: "#fff",
      default: grey[100],
      highlight: lightBlue[500]
    }
    // link: {
    //   main: get("--link-main"),
    //   visited: get("--link-visited"),
    //   active: get("--link-active")
    // }
  },
  typography: {
    fontFamily: ["Merriweather", "serif"],
    button: {
      fontFamily: ["Merriweather Sans", "sans-serif"],
      fontWeight: "bold"
    }
  }
});

const get = name => {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
};

const set = (name, value) => {
  document.documentElement.style.setProperty(name, value);
};
