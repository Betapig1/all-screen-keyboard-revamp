// File: main.cpp
#include <SDL2/SDL.h>
#include <GLES2/gl2.h>

const char* vertex_shader_src = R"(
attribute vec2 aPos;
void main() {
    gl_Position = vec4(aPos, 0.0, 1.0);
}
)";

const char* fragment_shader_src = R"(
void main() {
    gl_FragColor = vec4(1.0, 0.3, 0.2, 1.0);
}
)";

GLuint compile_shader(GLenum type, const char* src) {
    GLuint shader = glCreateShader(type);
    glShaderSource(shader, 1, &src, nullptr);
    glCompileShader(shader);
    GLint success = 0;
    glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
    if (!success) {
        char log[512];
        glGetShaderInfoLog(shader, 512, nullptr, log);
        SDL_Log("Shader compile error: %s", log);
    }
    return shader;
}

int main() {
    SDL_Init(SDL_INIT_VIDEO);

    // Set OpenGL ES version
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_ES);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 2);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 0);

    SDL_Window* window = SDL_CreateWindow("Triangle", 100, 100, 640, 480, SDL_WINDOW_OPENGL);
    SDL_GLContext gl_context = SDL_GL_CreateContext(window);
    SDL_GL_MakeCurrent(window, gl_context);

    // Compile shaders
    GLuint vtx_shader = compile_shader(GL_VERTEX_SHADER, vertex_shader_src);
    GLuint frag_shader = compile_shader(GL_FRAGMENT_SHADER, fragment_shader_src);

    // Link program
    GLuint program = glCreateProgram();
    glAttachShader(program, vtx_shader);
    glAttachShader(program, frag_shader);
    glBindAttribLocation(program, 0, "aPos");
    glLinkProgram(program);
    glUseProgram(program);

    // Triangle vertices
    float vertices[] = {
         0.0f,  0.5f,
        -0.5f, -0.5f,
         0.5f, -0.5f
    };

    GLuint vbo;
    glGenBuffers(1, &vbo);
    glBindBuffer(GL_ARRAY_BUFFER, vbo);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 0, 0);
    glEnableVertexAttribArray(0);

    // Main loop
    bool running = true;
    SDL_Event e;
    while (running) {
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_QUIT)
                running = false;
        }

        glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        glDrawArrays(GL_TRIANGLES, 0, 3);

        SDL_GL_SwapWindow(window);
    }

    SDL_GL_DeleteContext(gl_context);
    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}
