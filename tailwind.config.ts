import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-heading)", ...fontFamily.sans],
        serif: ["var(--font-body)", ...fontFamily.serif],
        heading: ["var(--font-heading)", ...fontFamily.sans],
        body: ["var(--font-body)", ...fontFamily.serif],
      },
      colors: {
        "fall-orange": "#EB781B",
        "fall-dark-orange": "#CC5221",
        "fall-brown": "#71250E",
        "fall-olive": "#6F6534",
        "fall-blue": "#365365",
      },
      backgroundColor: {
        "fall-primary": "#71250E",
        "fall-primary-hover": "#CC5221",
      },
    },
  },
} satisfies Config;
