precision highp float;

attribute vec3 position;

uniform mat4 modelViewMatrix;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = mvPosition;
}
