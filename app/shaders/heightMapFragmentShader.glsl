varying vec3 pos;
uniform float maxHeight;
uniform sampler2D u_texture;
varying vec2 vUv;

float hueToRgb(float p, float q, float t) {
    if (t < 0.f) {
        t = t+1.f;
    }
    if (t > 1.f) {
        t = t-1.f;
    } 
    if (t < 1.f/6.f) 
    {
        return p + (q - p) * 6.f * t;
    } 
    if (t < 1.f/2.f) 
    {
        return q;
    } 
    if (t < 2.f/3.f) 
    {
        return p + (q - p) * (2.f/3.f - t) * 6.f;
    } 
    return p;
}

void main() {
    float red = texture(u_texture, vUv).r;
    float green = texture(u_texture, vUv).g;
    float blue = texture(u_texture, vUv).b;

    float h = 1.f - (red*green*blue);
    float s = 1.f;
    float l = 0.5;

    // convert to rgb

    float r, g, b;

    if (s==0.f) {
        r=l;
        g=l;
        b=l;
    } else {
        float q, p;
        if (l < 0.5) {
            q = l * (1.f + s);
        } else {
            q = l + s - l * s;
        }
        p = 2.f * l - q;

        r = hueToRgb(p, q, h + 1.f/3.f);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1.f/3.f);
    }

    gl_FragColor = vec4(r, g, b, 1.f);
}
