precision highp float;

attribute vec3 position;

uniform mat4 mvp;

void main() {
    vec4 pos = mvp * vec4(position, 1.0);
    gl_PointSize = 100.0;
    gl_Position = pos;
}
