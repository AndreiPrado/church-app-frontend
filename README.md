# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Parallax

This project uses `react-scroll-parallax` to provide a smooth parallax effect on the Home page.

### Install

```
npm install react-scroll-parallax
```

### Setup

- App provider added in `src/main.jsx`:
  - Wraps the app with `ParallaxProvider`.
- Usage example in `src/home/home.component.jsx`:
  - `<Parallax translateY={[-20, 20]} opacity={[0.9, 1]}>` wraps the logo to create motion on scroll.

No additional configuration is required. If you change the navbar height, consider adjusting layout offsets accordingly.
