// This file is responsible for stubbing out gl when we target the web and not headless.
const gl = {
  gl: () => {}
}

export default { gl }