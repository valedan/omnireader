import { useMediaQuery } from "@material-ui/core";

export const useBigScreen = () => useMediaQuery("(min-width:1200px)");
export const useMedScreen = () => useMediaQuery("(min-width:700px)");
