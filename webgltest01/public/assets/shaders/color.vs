attribute vec3 aPosition;
attribute vec3 aColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec3 vColor;


void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aPosition, 1.0);
    vColor = aColor;
}
