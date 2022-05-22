
 
function copyNamedProperties(names: string[], src: any, dst: any) {
  names.forEach(function (name) {
    const value = src[name];
    if (value !== undefined) {
      dst[name] = value;
    }
  });
}


function copyExistingProperties(src: any, dst: any) {
  Object.keys(dst).forEach(function (key) {
    if (dst.hasOwnProperty(key) && src.hasOwnProperty(key)) {  /* eslint no-prototype-builtins: 0 */
      dst[key] = src[key];
    }
  });
}

function error(...args: any) {
  console.error(...args);
}

function warn(...args: any) {
  console.warn(...args);
}

function isBuffer(t: any) {
  return typeof WebGLBuffer !== 'undefined' && t instanceof WebGLBuffer;
}

function isRenderbuffer(t: any) {
  return typeof WebGLRenderbuffer !== 'undefined' && t instanceof WebGLRenderbuffer;
}

function isShader(t: any) {
  return typeof WebGLShader !== 'undefined' && t instanceof WebGLShader;
}

function isTexture(t: any) {
  return typeof WebGLTexture !== 'undefined' && t instanceof WebGLTexture;
}

function isSampler(t: any) {
  return typeof WebGLSampler !== 'undefined' && t instanceof WebGLSampler;
}

export {
  copyExistingProperties,
  copyNamedProperties,
  error,
  warn,
  isBuffer,
  isRenderbuffer,
  isShader,
  isTexture,
  isSampler,
};

