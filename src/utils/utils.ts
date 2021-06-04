
const createVertexShader = (PointSize: string) => {
    return '' +
        'attribute vec4 apos;' +
        'attribute vec4 a_color;' +
        'varying vec4 v_color;' +
        'void main(){' +
        '   float radian = radians(30.0);' +
        '   float cos = cos(radian);' +
        '   float sin = sin(radian);' +
        '   mat4 m4 = mat4(1,0,0,0,  0,cos,sin,0,  0,-sin,cos,0,  0,0,0,1);' +
        '   mat4 m24 = mat4(cos,0,-sin,0,  0,1,0,0,  sin,0,cos,0,  0,0,0,1);' +
        //给内置变量gl_PointSize赋值像素大小
        '   gl_PointSize=' + PointSize + ';' +
        //顶点位置，位于坐标原点
        '   gl_Position = m4*m24*apos;' +
        '   v_color = a_color;' +
        '}';
}
const createFragShader = () => {
    return "" +
        'precision lowp float;' +
        'varying vec4 v_color;'+
        'void main(){' +
        //定义片元颜色
        '   gl_FragColor =v_color;'+
        '}';
}
const initShader = (gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) => {
    //创建顶点着色器对象
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    //创建片元着色器对象
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    //引入顶点、片元着色器源代码
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    //编译顶点、片元着色器
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    //创建程序对象program
    var program = gl.createProgram()!;
    //附着顶点着色器和片元着色器到program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    //链接program
    gl.linkProgram(program);
    //使用program
    gl.useProgram(program);
    //返回程序program对象
    return program;
}
export {
    createVertexShader,
    createFragShader,
    initShader
}