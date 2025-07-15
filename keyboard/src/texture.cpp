//texture.cpp

#include "texture.h"
#include <SDL2/SDL_image.h>
#include <SDL2/SDL_opengles2.h>
#include <SDL2/SDL_ttf.h>

//swizzling changes image color order to texture unit RGBA order

bool SDLToGLSwizzle(GLenum channel, Uint32 mask){
	GLint swizzle;
	switch(mask){
	case 0x000000FF:
	#if SDL_BYTEORDER == SDL_BIG_ENDIAN
		swizzle = GL_ALPHA;
	#else
		swizzle = GL_RED;
	#endif
		break;
	case 0x0000FF00:
	#if SDL_BYTEORDER == SDL_BIG_ENDIAN
		swizzle = GL_BLUE;
	#else
		swizzle = GL_GREEN;
	#endif
		break;
	case 0x00FF0000:
	#if SDL_BYTEORDER == SDL_BIG_ENDIAN
		swizzle = GL_GREEN;
	#else
		swizzle = GL_BLUE;
	#endif
		break;
	case 0xFF000000:
	#if SDL_BYTEORDER == SDL_BIG_ENDIAN
		swizzle = GL_RED;
	#else
		swizzle = GL_ALPHA;
	#endif
		break;
	default:
		SDL_Log("Unrecognized color channel mask 0x%08X\n", mask);
		return false;
	}

	glTexParameteri(GL_TEXTURE_2D, channel, swizzle);
	return true;
}

GLuint SDLsurfaceToGLuint(SDL_Surface* textureSurface, const char* filename){
	//determine file format
	//ONLY SUPPORTS 24-BIT AND 32-BIT INTEGER IMAGES
	GLenum format;
	GLenum type = GL_UNSIGNED_BYTE;
	switch (textureSurface->format->BytesPerPixel){
		case 3:
			format = GL_RGB;
			break;
		case 4:
			format = GL_RGBA;
			break;
		default:
			SDL_Log("Image is not a 24 or 32-bit color image: %s\n", filename);
			SDL_FreeSurface(textureSurface);
			textureSurface = NULL;
			return 0;
	}
	
	//create the texture
	GLuint texture;
	glGenTextures(1, &texture);
	//SDL_Log("vt: %d", texture);
	glBindTexture(GL_TEXTURE_2D, texture);
	glTexImage2D(GL_TEXTURE_2D, 0, format, textureSurface->w, textureSurface->h, 0, format, type, textureSurface->pixels);
	GLenum err = glGetError();
	if (err != GL_NO_ERROR){
		SDL_Log("Creating texture from %s failed with error code %u\n", filename, err);
		glDeleteBuffers(1, &texture);
		texture = 0;
		SDL_FreeSurface(textureSurface);
		textureSurface = NULL;
		return 0;
	}

	//set up texture swizzling to match image channel order
	bool OK = SDLToGLSwizzle(GL_TEXTURE_SWIZZLE_R, textureSurface->format->Rmask);
	OK &= SDLToGLSwizzle(GL_TEXTURE_SWIZZLE_G, textureSurface->format->Gmask);
	OK &= SDLToGLSwizzle(GL_TEXTURE_SWIZZLE_B, textureSurface->format->Bmask);
	if (format == GL_RGBA){
		OK &= SDLToGLSwizzle(GL_TEXTURE_SWIZZLE_A, textureSurface->format->Amask);
	}
	if (!OK){
		SDL_Log("Could not swizzle texture %s\n", filename);
		glDeleteBuffers(1, &texture);	
		texture = 0;
		SDL_FreeSurface(textureSurface);
		textureSurface = NULL;
		return 0;
	}

	//set up filtering
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

	//free memory
	SDL_FreeSurface(textureSurface);	//surface is now in vram, no need to keep in ram
	textureSurface = NULL;
	
	return texture;
}

GLuint textureLoad(const char* filename){
	//support for both JPG and PNG
	int flags = IMG_INIT_JPG | IMG_INIT_PNG;
	if ((IMG_Init(flags) & flags) == 0){
		SDL_Log("JPG or PNG loaders not found\n");
		return 0;
	}
	//load image
	SDL_Surface* textureSurface = IMG_Load(filename);
	if (!textureSurface){
		SDL_Log("Loading image %s failed with error: %s\n", filename, IMG_GetError());
		return 0;
	}

	return SDLsurfaceToGLuint(textureSurface, filename);
}

GLuint textureLoadFromFont(const char* filename, const char* string, int size, SDL_Color color){
	//load font and render text to SDL surface
		SDL_Log("text surface failed: %s\n", filename);
	
	TTF_Init();
	TTF_Font* font = TTF_OpenFont(filename, size);
	SDL_Surface* textureSurface2 = TTF_RenderUTF8_Blended(font, string, color);
	SDL_Surface* textureSurface = SDL_ConvertSurfaceFormat(textureSurface2, SDL_PIXELFORMAT_RGBA32, 0);
	if (!textureSurface){
		SDL_Log("text surface failed: %s\n", TTF_GetError());
	}

	return SDLsurfaceToGLuint(textureSurface, filename);
}

GLuint textureFromSDLSurface(SDL_Surface* surface){
	return SDLsurfaceToGLuint(surface, "video file");
}

void replaceTextureFromSDLSurface(GLuint texture, SDL_Surface* textureSurface){
	//SDL_SaveBMP(textureSurface, "output.bmp");
	GLenum format;
	GLenum type = GL_UNSIGNED_BYTE;
	switch (textureSurface->format->BytesPerPixel){
		case 3:
			format = GL_RGB;
			break;
		case 4:
			format = GL_RGBA;
			break;
		default:
			SDL_Log("Image is not a 24 or 32-bit color image\n");
			SDL_FreeSurface(textureSurface);
			textureSurface = NULL;
			return;
	}
	
	//create the texture
	glBindTexture(GL_TEXTURE_2D, texture);
	//SDL_Log("vt: %d", texture);
	glTexSubImage2D(GL_TEXTURE_2D, 0, 0, 0,
		textureSurface->w, textureSurface->h, format, type, textureSurface->pixels);
		
	GLenum err = glGetError();
	if (err != GL_NO_ERROR){
		SDL_Log("Creating texture failed with error code %u\n", err);
		glDeleteBuffers(1, &texture);
		texture = 0;
		SDL_FreeSurface(textureSurface);
		textureSurface = NULL;
		return;
	}
	
	//set up texture swizzling to match image channel order
	bool OK = SDLToGLSwizzle(GL_TEXTURE_SWIZZLE_R, textureSurface->format->Rmask);
	OK &= SDLToGLSwizzle(GL_TEXTURE_SWIZZLE_G, textureSurface->format->Gmask);
	OK &= SDLToGLSwizzle(GL_TEXTURE_SWIZZLE_B, textureSurface->format->Bmask);
	if (format == GL_RGBA){
		OK &= SDLToGLSwizzle(GL_TEXTURE_SWIZZLE_A, textureSurface->format->Amask);
	}
	if (!OK){
		SDL_Log("Could not swizzle texture\n");
		glDeleteBuffers(1, &texture);	
		texture = 0;
		SDL_FreeSurface(textureSurface);
		textureSurface = NULL;
		return;
	}

	//set up filtering
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

	//free memory
	SDL_FreeSurface(textureSurface);	//surface is now in vram, no need to keep in ram
	textureSurface = NULL;
	
	return;
}

void textureDestroy(GLuint textureName){
	glDeleteTextures(1, &textureName);
}