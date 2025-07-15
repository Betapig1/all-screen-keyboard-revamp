//keyboard.h
#include <stdio.h>
#include <chrono>
#include <thread>
#include <vector>
#include <string>
#include "wiringPi.h"
#include "wiringPiSPI.h"
#include <GLES3/gl3.h>
#include <SDL2/SDL.h>
#include <SDL2/SDL_opengles2.h>
#include <iostream>
#include <sstream>
#include <sys/stat.h>
#include <fstream>

#include "readHallEffect.h"
#include "graphics.h"
#include "bluetooth.h"
#include "physicalLayout.h"

#define MAXKEYS 112

class keyboard{

public:
	keyboard();
int  startSerialListener(const std::string& device = "/dev/ttyUSB0");
 int  installProfileZip(const std::string& zipPath);
	int run();

private:
	void keyboardMonitor(bool* on);	//runs keyboad evens anditnerfaces with bluetoth library

	int assignKey(int keyID, int outputType, std::string outputString);
	//layout types
	#define LAYOUTIMG 0
	#define LAYOUTTEXT 1
	//output types
	#define OUTPUTKEYOUT 0
	#define OUTPUTPROFILESWITCH 1
	//keyEvent(int eventType, string eventString, int supplementalKey)
		//if supplemental key is pressed (or not, it's optional) then raise the event
		//such as switching profile, or using some shader...
	
		//keyShiftevent
		//keyCAPSevent
		//keyCtrlevent
		//keyAltevent
		//keyFNevent

	//load initial profile:

	// keyboard.h  (add to public:)
bool handleIncomingMessage(int fd);                 // internal

	int loadProfile(const char* profileFolderName, bool mainThread=true);
		int parseLine(std::string line);
		std::vector<std::string> splitPreserveQuotes(const std::string& str);
	int swapProfile(const char* newProfileFolderName);
	
	int textureKey(int keyID, int layoutType, std::string layoutString, float width, float height);
	int rectKey(int keyID, int r, int g, int b, int a, float width, float height);
	int circleKey(int keyID, int radius, int segments, int r, int g, int b, int a);
	
	int assignKeyFont(const char* fontname);
	int assignTextColor(int r, int g, int b, int a);
	int setKeyboardBGImg(const char* src);
	int assignKeyboardBackgroundColor(int r, int g, int b, int a);

	int freeRect(int x, int y, int w, int h, int r, int g, int b, int a);
	int freeCircle(int x, int y, int radius, int segments, int r, int g, int b, int a);
	int freeText(int x, int y, const char* toWrite, float size, int r, int g, int b, int a);
	//you could add custom shader numbers as an optional parameter
	
	int loadVideo(const char* filename, int x, int y, int w, int h);
	
	//loadShaders
	int loadCustomShader(const char* vertexShader, const char* fragmentShader, int shaderType);
	
	void runHallEffectSensors(bool* on);

	//structs
	struct color {
		int r;
		int g;
		int b;
		int a;
	};

	struct rectangle {
		int x;
		int y;
		int w;
		int h;
	};

	struct key {
		int ID;
		rectangle bounds;
		int outputType;
		std::string output;
	};
	
	//for functions that need to be run in main thread:
	bool inMainThread = true;	//starts in main thread

	//variables
	window* keyboardWindow;
	bluetooth* bluetoothConn;
	physicalLayout* pl;
	color textColor;
	
	//key variables
	std::vector<key> keys;
	#define avgSize 10
	int keyVals[MAXKEYS][avgSize];
	int keySignal[MAXKEYS];
	bool pressedKeys[MAXKEYS] = { false };
	
	//debugging text:
	bool debugTextOn = false;
	std::vector<text*> debugText;
};