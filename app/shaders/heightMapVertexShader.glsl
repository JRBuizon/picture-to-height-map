varying vec3 pos;
uniform float u_maxHeight;
uniform sampler2D u_texture;
uniform float u_elapsedTime;
varying vec2 vUv;

void main() {
    pos = position;
    vUv = uv; // Pass UV coordinates
    float red = texture(u_texture, vUv).r;
    float green = texture(u_texture, vUv).g;
    float blue = texture(u_texture, vUv).b;

    float newHeight = (red * green * blue * u_maxHeight);
    
    vec4 pos_2;
    if (u_elapsedTime*u_elapsedTime*2.f*30.f < newHeight/2.f) {
        pos_2 = modelMatrix * vec4(position.x, position.y, -(u_elapsedTime * u_elapsedTime * 2.f)*30.f, 1.0);
    } else if (u_elapsedTime*u_elapsedTime*2.f*30.f < newHeight) {
        pos_2 = modelMatrix * vec4(position.x, position.y, -(u_elapsedTime * u_elapsedTime * 2.f)*30.f, 1.0);
    } else {
        pos_2 = modelMatrix * vec4(position.x, position.y, -newHeight, 1.0);
    }

    gl_Position = projectionMatrix * viewMatrix * pos_2;
}

