precision highp float;

attribute vec3 position;
attribute vec2 uv;
varying vec2 vUv;

uniform mat4 mvp;

void main() {
    vec4 pos = mvp * vec4(position, 1.0);
    vUv = uv;
    gl_Position = pos;
}
