// keyboard.cpp

#include "keyboard.h"

#include <thread>
#include <fstream>
#include <filesystem>
#include <fcntl.h>
#include <termios.h>
#include <unistd.h>
#include <system_error>

using namespace std;

#define CSp0 17
#define CSp1 20
#define CSp2 22
#define CSp3 25
#define SPIchannel 0
#define SPIspeed 500000

constexpr std::uint8_t MSG_ZIP = 0x01;
constexpr std::uint8_t MSG_TEXT = 0x02;

int keyboard::installProfileZip(const std::string &zipPath)
{
	namespace fs = std::filesystem;
	const fs::path destRoot = "profiles";

	/* 1. make sure profiles/ exists  */
	fs::create_directories(destRoot);

	/* 2. extract into a temp dir inside profiles/ */
	const fs::path tmpDir = destRoot / "__tmp_unzip__";
	fs::remove_all(tmpDir); // clean previous temp
	fs::create_directory(tmpDir);

	std::string cmd = "unzip -o -qq \"" + zipPath + "\" -d \"" + tmpDir.string() + "\"";
	if (std::system(cmd.c_str()) != 0)
	{
		std::cerr << "unzip failed\n";
		return -1;
	}

	/* 3. find first top‑level dir in tmpDir */
	std::string profileName;
	for (const auto &entry : fs::directory_iterator(tmpDir))
	{
		if (entry.is_directory())
		{
			profileName = entry.path().filename().string(); // e.g. "eng"
			break;
		}
	}
	if (profileName.empty())
	{
		std::cerr << "zip had no top level directory\n";
		return -2;
	}

	/* 4. move that directory into profiles/ (overwrite if exists) */
	const fs::path target = destRoot / profileName;
	fs::remove_all(target); // overwrite old profile
	fs::rename(tmpDir / profileName, target);
	fs::remove_all(tmpDir); // clean temp

	/* 5. hot‑swap */
	if (swapProfile(profileName.c_str()) != 0)
	{
		std::cerr << "profile swap failed\n";
		return -3;
	}
	std::cout << "✓ Installed & loaded profile \"" << profileName << "\"\n";
	return 0;
}

static int openSerial(const char *dev, int baud = B115200)
{
	int fd = ::open(dev, O_RDONLY | O_NOCTTY);
	if (fd < 0)
		throw std::system_error(errno, std::generic_category(), "open");
	termios tty{};
	tcgetattr(fd, &tty);
	cfsetospeed(&tty, baud);
	cfsetispeed(&tty, baud);
	cfmakeraw(&tty);
	tty.c_cflag |= (CLOCAL | CREAD);
	tcsetattr(fd, TCSANOW, &tty);
	return fd;
}

bool keyboard::handleIncomingMessage(int fd)
{
	/* ── 1. read 4‑byte length ─────────────────────────────── */
	std::uint8_t hdr[4];
	if (::read(fd, hdr, 4) != 4)
		return false;

	std::uint32_t len = (hdr[0] << 24) | (hdr[1] << 16) | (hdr[2] << 8) | hdr[3];
	if (len == 0 || len > 10 * 1024 * 1024)
		return false; // sanity

	/* ── 2. read 1‑byte type ───────────────────────────────── */
	std::uint8_t type;
	if (::read(fd, &type, 1) != 1)
		return false;
	if (--len == 0)
		return false; // nothing left

	/* ── 3. read payload ──────────────────────────────────── */
	std::vector<std::uint8_t> payload(len);
	std::size_t got = 0;
	while (got < len)
	{
		ssize_t n =
			::read(fd, payload.data() + got,
				   static_cast<size_t>(len - got));
		if (n <= 0)
			return false;
		got += static_cast<std::size_t>(n);
	}

	/* ── 4. dispatch on type ──────────────────────────────── */
	switch (type)
	{
	case MSG_ZIP:
	{
		const std::string tmp = "/tmp/profile.zip";
		std::ofstream out(tmp, std::ios::binary);
		out.write(reinterpret_cast<char *>(payload.data()),
				  static_cast<std::streamsize>(payload.size()));
		out.close();
		std::cout << "Received ZIP (" << payload.size() << " bytes)…\n";
		return installProfileZip(tmp) == 0;
	}
	case MSG_TEXT:
	{
		std::string cmd(payload.begin(), payload.end()); // UTF‑8
		std::cout << "CMD: \"" << cmd << "\"\n";
		/*hot‑swap */
		if (swapProfile(cmd) != 0)
		{
			std::cerr << "profile swap failed\n";
			return false;
		}
		std::cout << " Loaded profile \"" << cmd << "\"\n";
		return true;
	}
	default:
		std::cerr << "Unknown message type 0x"
				  << std::hex << int(type) << std::dec << '\n';
		return false;
	}
}

int keyboard::startSerialListener(const std::string &dev)
{
	std::thread([this, dev]
				{
        try {
            int fd = openSerial(dev.c_str());
            while (true) {
                if (!handleIncomingMessage(fd))
                    std::cerr << "Serial transfer error waiting for next\n";
            }
            ::close(fd);
        } catch (const std::exception& e) {
            std::cerr << "Serial listener fatal: " << e.what() << '\n';
        } })
		.detach();
	return 0;
}

keyboard::keyboard()
{
	keyboardWindow = new window();
	int OK = keyboardWindow->initialize(2560, 1440);
	// int OK = keyboardWindow->initialize(1920, 1080, false);
	if (OK != 0)
	{
		printf("Error initializing window\n");
		return;
	}

	// get physical layouts:
	pl = new physicalLayout();
	vector<physicalLayout::keyRect> keyrects = pl->getPhysicalKeySizes();

	// initialize keys at locations
	if (keyrects.size() != MAXKEYS)
	{
		printf("Error in number of keys initialized");
	}
	for (int i = 0; i < keyrects.size(); i++)
	{
		keys.push_back({i, {keyrects[i].x, keyrects[i].y, keyrects[i].w, keyrects[i].h}, -1, " "}); // no output
		cout << i << endl;
	}

	// assign ID and location of initial 16 keys:
	/*
	int keySize = 96;
	int rowGap = 120 - keySize;
	int offsetX = 0;//2096;
	int offsetY = 0;//895;
		keys.push_back({ 0, {offsetX + (keySize + rowGap) * 1, offsetY, keySize, keySize}, 0, "/" });
		keys.push_back({ 1, {offsetX + (keySize + rowGap) * 2, offsetY, keySize, keySize}, 0, "*" });
		keys.push_back({ 2, {offsetX + (keySize + rowGap) * 3, offsetY, keySize, keySize}, 0, "-" });

		keys.push_back({ 3, {offsetX + (keySize + rowGap) * 3, offsetY + (keySize + rowGap) * 1, keySize, keySize*2 + rowGap}, 0, "+" });
		keys.push_back({ 4, {offsetX + (keySize + rowGap) * 2, offsetY + (keySize + rowGap) * 1, keySize, keySize}, 0, "9" });
		keys.push_back({ 5, {offsetX + (keySize + rowGap) * 1, offsetY + (keySize + rowGap) * 1, keySize, keySize}, 0, "8" });
		keys.push_back({ 6, {offsetX, offsetY + (keySize + rowGap) * 1, keySize, keySize}, 0, "7" });

		keys.push_back({ 7, {offsetX, offsetY + (keySize + rowGap) * 2, keySize, keySize}, 0, "4" });
		keys.push_back({ 8, {offsetX + (keySize + rowGap) * 1, offsetY + (keySize + rowGap) * 2, keySize, keySize}, 0, "5" });
		keys.push_back({ 9, {offsetX + (keySize + rowGap) * 2, offsetY + (keySize + rowGap) * 2, keySize, keySize}, 0, "6" });

		keys.push_back({ 10, {offsetX + (keySize + rowGap) * 3, offsetY + (keySize + rowGap) * 3, keySize, keySize*2 + rowGap}, 0, "\n" });
		keys.push_back({ 11, {offsetX + (keySize + rowGap) * 2, offsetY + (keySize + rowGap) * 3, keySize, keySize}, 0, "3" });
		keys.push_back({ 12, {offsetX + (keySize + rowGap) * 1, offsetY + (keySize + rowGap) * 3, keySize, keySize}, 0, "2" });
		keys.push_back({ 13, {offsetX, offsetY + (keySize + rowGap) * 3, keySize, keySize}, 0, "1" });

		keys.push_back({ 14, {offsetX, offsetY + (keySize + rowGap) * 4, keySize*2 + rowGap, keySize}, 0, "0" });
		keys.push_back({ 15, {offsetX + (keySize + rowGap) * 2, offsetY + (keySize + rowGap) * 4, keySize, keySize}, 0, "." });
		*/

	return;
}

int keyboard::run()
{
	// init bluetooth connection:
	bluetoothConn = new bluetooth();
	// run hall effect sensors
	bool keyboardActive = true;
	bool *on = &keyboardActive;
	startSerialListener("/dev/ttyS0");
	loadProfile("eng");

	// run numpad profile initialization:

	// frame counter text:
	debugText.push_back(keyboardWindow->writeText("000", 100, 100, 2.0f, 0, 0, 0, 255));

	// debugging text:
	/*/
	debugTextOn = true;
	for (int i = 0; i < MAXKEYS; i++){
		debugText.push_back(keyboardWindow->writeText("000", keys[i].bounds.x + 25, keys[i].bounds.y + 40, 0.5f, 0, 0, 0, 255));
	}/**/

	/*/
	for (int i = 0; i < MAXKEYS; i++){
		rectKey(i, 0, 0, 0, 100, 1.0f, 1.0f);
		textureKey(i, 1, to_string(i), 1.0f, 1.0f);
	}
	/**/

	/*	keyboardWindow->drawImage("img/wide.jpeg", 110, 10, 100, 100, 255);
		keyboardWindow->drawRect(10, 10, 100, 200, 255, 225, 0, 255);
		keyboardWindow->drawText("\u003F", 400, 10, 100, 200, 0, 0, 255, 255);
		assignKeyFont("img/HanyiSentyPagoda Regular.ttf");
		keyboardWindow->drawText("hello world", 300, 300, 250, 100, 0, 255, 0, 255);
		keyboardWindow->drawImage("img/wide.jpeg", 50, 50, 200, 100, 255);
		keyboardWindow->setbackrgoundColor(255, 0, 0, 255);
		keyboardWindow->setbackgroundImage("img/wide.jpeg");
		keyboardWindow->drawCircle(300, 380, 100, 6, 0, 255, 255, 255);
	*/

	// run bluetooth interaction:
	thread bluetoothThread([this, on]()
						   { bluetoothConn->begin(on, false); }); // true for testing, false for bluetooth on
	// run hall effect thread:
	thread hallEffectThread([this, on]()
							{ runHallEffectSensors(on); });

	// keyboard monitor thread:
	thread monitorThread([this, on]()
						 { keyboardMonitor(on); });

	// run graphics thread:
	keyboardWindow->runWindow(pressedKeys); // graphics calls must run in main thread

	keyboardActive = false;
	hallEffectThread.join(); // wait for hall effect polling to finish
	monitorThread.join();
	bluetoothThread.join();

	return 0; // ends program
}

// hall effect sensors -------------------------------------------------------------------
void keyboard::runHallEffectSensors(bool *on)
{
	// create and initailize new hallEffectReader class
	hallEffectReader *hallEffectKeyboard = new hallEffectReader();
	hallEffectKeyboard->initSPI(SPIchannel, SPIspeed, CSp0, CSp1, CSp2, CSp3);

	// initialize all to zero
	for (int i = 0; i < MAXKEYS; i++)
	{
		for (int j = 0; j < avgSize; j++)
		{
			keyVals[i][j] = 0;
		}
		keySignal[i] = 0;
	}

	int index = 0;
	int globalAverage = 0;

	Uint32 lastTime = SDL_GetTicks();
	Uint32 currentTime = SDL_GetTicks();

	while (*on)
	{
		// poll:
		for (int i = 0; i < MAXKEYS; i++)
		{
			keyVals[i][index] = hallEffectKeyboard->readHallEffectSensor(i);
			// cout << "Key " << i << ": " << keyVals[i][index] << endl;
			keySignal[i] = 0;
			// calculate average:
			for (int j = 0; j < avgSize; j++)
			{
				keySignal[i] += keyVals[i][j];
			}
			keySignal[i] /= avgSize;
			if (i != 0 && debugTextOn)
				debugText[i + 1]->updateText(to_string(keySignal[i]).c_str()); // 0th debug is FPS, so increase by 1
		}
		// determining global average:
		globalAverage = 0;
		for (int i = 0; i < MAXKEYS; i++)
		{
			globalAverage += keySignal[i];
		}
		globalAverage /= MAXKEYS;
		if (debugTextOn)
			debugText[1]->updateText(to_string(globalAverage).c_str()); // 0th debug is FPS, so increase by 1

		// checking which are pressed:
		for (int i = 0; i < MAXKEYS; i++)
		{
			if (keySignal[i] < globalAverage - 35)
			{
				if ((i == 0 || i == 5 || i == 1 || i == 24 || i == 31 || i == 54 || i == 57 || i == 58 || i == 59 || i == 66 || i == 28 || i == 43) && keySignal[i] >= globalAverage - 80) // these two keys have sensitivity issues
					pressedKeys[i] = false;
				else
					pressedKeys[i] = true;
			}
			else
				pressedKeys[i] = false;
		}

		// waiting:
		/*
		currentTime = SDL_GetTicks();
		while (currentTime - lastTime < 1){	//
			currentTime = SDL_GetTicks();
		}
		lastTime = currentTime;
		*/

		// increase index:
		index++;
		if (index >= avgSize)
		{
			index = 0;
		}
		// mark as pressed:
		// pressedKeys[i] = true;
	}
	return;
}

void keyboard::keyboardMonitor(bool *on)
{
	// monitor for first 6 non-modifier keys that are pressed and add to report
	// if no keys (including modifier keys) are pressed when last check there were, a final null report is sent
	// currently the function only checks for first 6 in the pressed array, optimally it should check for last 6 pressed
	bool lastKeyStatus[MAXKEYS] = {false};

	Uint32 lastTime = SDL_GetTicks();
	Uint32 currentTime = SDL_GetTicks();

	bool leftCtrl, leftShift, leftAlt, leftMeta, rightCtrl, rightShift, rightAlt, rightMeta = false;
#define leftCtrlKey 5
#define leftShiftKey 4
#define leftAltKey 7
#define leftMetaKey 6
#define rightCtrlKey 79
#define rightShiftKey 75
#define rightAltKey 76
#define rightMetaKey 77
	int modKeyIndex[8] = {leftCtrlKey, leftShiftKey, leftAltKey, leftMetaKey, rightCtrlKey, rightShiftKey, rightAltKey, rightMetaKey};

	int pressCount = 0;
	unsigned char outputKeys[6];
	unsigned char lastOutputKeys[7];
	bool lastRoundHadKeys = false;
	unsigned char modKeys;

	while (*on)
	{
		leftCtrl = pressedKeys[leftCtrlKey];
		leftShift = pressedKeys[leftShiftKey];
		leftAlt = pressedKeys[leftAltKey];
		leftMeta = pressedKeys[leftMetaKey];
		rightCtrl = pressedKeys[rightCtrlKey];
		rightShift = pressedKeys[rightShiftKey];
		rightAlt = pressedKeys[rightAltKey];
		rightMeta = pressedKeys[rightMetaKey];

		// reset press count
		pressCount = 0;
		for (int i = 0; i < 6; i++)
			outputKeys[i] = 0;

		for (int i = 0; i < MAXKEYS; i++)
		{
			// check for events
			if (lastKeyStatus[i] && !pressedKeys[i] && keys[i].outputType == OUTPUTPROFILESWITCH)
			{ // on key up
				// switch profile
				swapProfile(keys[i].output.c_str());
			}
			lastKeyStatus[i] = pressedKeys[i];

			// check for key presses
			if (i == leftCtrlKey || i == leftShiftKey || i == leftAltKey || i == leftMetaKey ||
				i == rightCtrlKey || i == rightShiftKey || i == rightAltKey || i == rightMetaKey)
			{ // do not count modifier keys
				continue;
			}

			if (pressedKeys[i] && keys[i].outputType == OUTPUTKEYOUT)
			{
				// add to output array
				outputKeys[pressCount++] = bluetoothConn->getKeyCode(keys[i].output);
				if (pressCount >= 6)
					break;
			}
		}

		modKeys = bluetoothConn->getModSignal(leftCtrl, leftShift, leftAlt, leftMeta, rightCtrl, rightShift, rightAlt, rightMeta);

		// if only mod keys are pressed, then send the mod key code
		if (pressCount == 0 && modKeys > 0)
		{
			for (int i = 0; i < 8; i++)
			{
				if (pressedKeys[modKeyIndex[i]])
				{
					outputKeys[0] = bluetoothConn->getKeyCode(keys[modKeyIndex[i]].output); // just send the one
					break;
				}
			}
		}

		// output to bluetooth:
		if (pressCount > 0 || modKeys > 0 || lastRoundHadKeys)
		{
			bool notDifferent = true;
			// compare last keys
			if (lastOutputKeys[0] != modKeys)
			{
				notDifferent = false;
			}
			for (int i = 0; i < 6; i++)
			{
				if (lastOutputKeys[i + 1] != outputKeys[i])
				{
					notDifferent = false;
					break;
				}
			}
			if (!notDifferent)
			{ // only output for new events
				bluetoothConn->write(modKeys, outputKeys[0], outputKeys[1], outputKeys[2], outputKeys[3], outputKeys[4], outputKeys[5]);
				bluetoothConn->write(modKeys, outputKeys[0], outputKeys[1], outputKeys[2], outputKeys[3], outputKeys[4], outputKeys[5]);
			}
			// set last keys
			lastOutputKeys[0] = modKeys;
			for (int i = 0; i < 6; i++)
			{
				lastOutputKeys[i + 1] = outputKeys[i];
			}
		}
		if (pressCount > 0 || modKeys > 0)
			lastRoundHadKeys = true;
		else
			lastRoundHadKeys = false;

		// wait:
		currentTime = SDL_GetTicks();
		while (currentTime - lastTime < 1)
		{ // 1000 polls per second
			currentTime = SDL_GetTicks();
		}
		lastTime = currentTime;
	}
}

// key assignment -----------------------------------------------------------------------
int keyboard::assignKey(int keyID, int outputType, string outputString)
{
	if (keyID >= MAXKEYS)
	{
		SDL_Log("Key assignment error: KeyID over %d found: %d", MAXKEYS, keyID);
		return -1;
	}
	// set key output:
	if (outputType <= OUTPUTPROFILESWITCH)
	{
		keys[keyID].outputType = outputType;
		keys[keyID].output = outputString;

		cout << "Key ID " << keyID << "...\n";
		cout << "Key Type " << outputType << "...\n";
		cout << "Key String " << outputString << "...\n";
	}
	else
	{
		SDL_Log("Key assignment error: output of unknown type: %d", outputType);
		return -1;
	}

	return 0;
}

int keyboard::textureKey(int keyID, int layoutType, string layoutString, float width, float height)
{
	int keyIDRaw = keyID & 0xFF;
	if (keyIDRaw >= MAXKEYS)
	{
		SDL_Log("Key assignment error: KeyID over %d found: %d", MAXKEYS, keyIDRaw);
		return -1;
	}
	// set key texture
	float centerX = static_cast<float>(keys[keyIDRaw].bounds.x + (keys[keyIDRaw].bounds.w / 2));
	float centerY = static_cast<float>(keys[keyIDRaw].bounds.y + (keys[keyIDRaw].bounds.h / 2));
	rectangle destRect = {
		static_cast<int>(centerX - ((static_cast<float>(keys[keyIDRaw].bounds.w) / 2) * width)),
		static_cast<int>(centerY - ((static_cast<float>(keys[keyIDRaw].bounds.h) / 2) * height)),
		static_cast<int>(static_cast<float>(keys[keyIDRaw].bounds.w) * width),
		static_cast<int>(static_cast<float>(keys[keyIDRaw].bounds.h) * height)};
	switch (layoutType)
	{
	case LAYOUTIMG:
		// int drawImage(const char* src, int x, int y, int width, int height, int a);
		if (inMainThread)
			keyboardWindow->drawImage(layoutString.c_str(),
									  destRect.x, destRect.y, destRect.w, destRect.h,
									  255, keyID);
		else
		{
			keyboardWindow->requestDrawImage(layoutString.c_str(),
											 destRect.x, destRect.y, destRect.w, destRect.h,
											 255, keyID);
			while (!keyboardWindow->asyncFunctionCompleted())
				__asm__("nop");
		}
		break;
	case LAYOUTTEXT:
		// int drawText(const char* text, int x, int y, int width, int height, int r, int g, int b, int a);
		if (inMainThread)
			keyboardWindow->drawText(layoutString.c_str(),
									 destRect.x, destRect.y, destRect.w, destRect.h,
									 textColor.r, textColor.g, textColor.b, textColor.a,
									 keyID);
		else
		{
			keyboardWindow->requestDrawText(layoutString.c_str(),
											destRect.x, destRect.y, destRect.w, destRect.h,
											textColor.r, textColor.g, textColor.b, textColor.a,
											keyID);
			while (!keyboardWindow->asyncFunctionCompleted())
				__asm__("nop");
		}
		break;
	default:
		SDL_Log("Key assignment error: layout of unknown type: %d", layoutType);
		return -1;
		break;
	}
	return 0;
}

int keyboard::rectKey(int keyID, int r, int g, int b, int a, float width, float height)
{
	// draw rectangle centered on key rect
	float centerX = static_cast<float>(keys[keyID].bounds.x + (keys[keyID].bounds.w / 2));
	float centerY = static_cast<float>(keys[keyID].bounds.y + (keys[keyID].bounds.h / 2));
	rectangle destRect = {
		static_cast<int>(centerX - ((static_cast<float>(keys[keyID].bounds.w) / 2) * width)),
		static_cast<int>(centerY - ((static_cast<float>(keys[keyID].bounds.h) / 2) * height)),
		static_cast<int>(static_cast<float>(keys[keyID].bounds.w) * width),
		static_cast<int>(static_cast<float>(keys[keyID].bounds.h) * height)};
	if (inMainThread)
		return keyboardWindow->drawRect(destRect.x, destRect.y, destRect.w, destRect.h, r, g, b, a, keyID);
	// else request async
	keyboardWindow->requestDrawRect(destRect.x, destRect.y, destRect.w, destRect.h, r, g, b, a, keyID);
	while (!keyboardWindow->asyncFunctionCompleted())
		__asm__("nop");
	return keyboardWindow->asyncOutput();
}

int keyboard::circleKey(int keyID, int radius, int segments, int r, int g, int b, int a)
{
	if (inMainThread)
		return keyboardWindow->drawCircle(keys[keyID].bounds.x + (keys[keyID].bounds.w / 2),
										  keys[keyID].bounds.y + (keys[keyID].bounds.h / 2), radius, segments,
										  r, g, b, a, keyID);
	// else request async
	keyboardWindow->requestDrawCircle(keys[keyID].bounds.x + (keys[keyID].bounds.w / 2),
									  keys[keyID].bounds.y + (keys[keyID].bounds.h / 2), radius, segments,
									  r, g, b, a, keyID);
	while (!keyboardWindow->asyncFunctionCompleted())
		__asm__("nop");
	return keyboardWindow->asyncOutput();
}

int keyboard::assignKeyFont(const char *fontname)
{
	return keyboardWindow->setFont(fontname);
}
int keyboard::assignKeyboardBackgroundColor(int r, int g, int b, int a)
{
	if (r < 256 && g < 256 && b < 256 && a < 256)
		keyboardWindow->setbackrgoundColor(r, g, b, a);
	else
	{
		SDL_Log("Color value over 255 detected");
		return -1;
	}
	return 0;
}

int keyboard::assignTextColor(int r, int g, int b, int a)
{
	if (r < 256 && g < 256 && b < 256 && a < 256)
		textColor = {r, g, b, a};
	else
	{
		SDL_Log("Color value over 255 detected");
		return -1;
	}
	return 0;
}

int keyboard::swapProfile(const char *newProfileFolderName)
{
	keyboardWindow->setGraphicsLock(true); // lock the graphics process to allow for async requests
	while (keyboardWindow->isRendering())
		__asm__("nop");								 // wait for rendering to finish
	return loadProfile(newProfileFolderName, false); // does not run in main thread
}

int keyboard::loadProfile(const char *profileFolderName, bool mainThread)
{
	inMainThread = mainThread;
	// determine if the profile to load exists:
	struct stat sb;
	const char *profiles = "profiles/";
	char *path = new char[strlen(profiles) + strlen(profileFolderName) + 1];
	strcpy(path, profiles);
	strcat(path, profileFolderName);
	if (!(stat(path, &sb) == 0 && S_ISDIR(sb.st_mode)))
	{
		cout << "No profile folder with name: " << path << " found" << endl;
		return -1;
	}
	cout << "Loading keyboard profile: " << path << endl;

	// determine if layout.prof is found
	const char *profile = "/layout.prof";
	char *profPath = new char[strlen(path) + strlen(profile) + 1];
	strcpy(profPath, path);
	strcat(profPath, profile);
	ifstream file(profPath);
	if (!file.good())
	{
		cout << "No layout.prof file found in " << path << endl;
		return -1;
	}
	// cout << "Loading layout.prof..." << endl;
	char cwd[PATH_MAX];
	if (getcwd(cwd, sizeof(cwd)) != nullptr)
	{
		cout << "Current directory:" << cwd << endl;
	}
	// at this point it's okay to clear the graphics memory:
	if (mainThread)
		keyboardWindow->clearGraphicsMemory();
	else
	{
		cout << "non-main thread clearing" << endl;
		keyboardWindow->requestClear();
		while (!keyboardWindow->asyncFunctionCompleted())
			__asm__("nop");
	}

	// read file and update layout
	string line;
	int lineNumber = 1;
	if (file.is_open())
	{
		while (getline(file, line))
		{ // read in one line at a time
			int result = parseLine(line);
			switch (result)
			{
			case 1:
				cout << "\033[33;1mError parsing layout.prof on line " << lineNumber << ", argument not recognized\033[0m" << endl;
				break;
			case 2:
				cout << "\033[33;1mError parsing layout.prof on line " << lineNumber << ", incorrect number of parameters\033[0m" << endl;
				break;
			case 3:
				cout << "\033[33;1mError parsing layout.prof on line " << lineNumber << ", argument types incorrect\033[0m" << endl;
				break;
			case 4:
				cout << "\033[33;1mError parsing layout.prof on line " << lineNumber << ", error exucting requested function\033[0m" << endl;
				break;
			case 0:
			default:
				break; // no errors
			}
			lineNumber++;
		}
		file.close();
	}

	// unlock graphics:
	keyboardWindow->setGraphicsLock(false);
	// profile loaded sucessfully
	return 0;
}

int keyboard::freeRect(int x, int y, int w, int h, int r, int g, int b, int a)
{
	if (inMainThread)
		return keyboardWindow->drawRect(x, y, w, h, r, g, b, a);
	// else request async
	keyboardWindow->requestDrawRect(x, y, w, h, r, g, b, a);
	while (!keyboardWindow->asyncFunctionCompleted())
		__asm__("nop");
	return keyboardWindow->asyncOutput();
}
int keyboard::freeCircle(int x, int y, int radius, int segments, int r, int g, int b, int a)
{
	if (inMainThread)
		return keyboardWindow->drawCircle(x, y, radius, segments, r, g, b, a);
	// else request async
	keyboardWindow->requestDrawCircle(x, y, radius, segments, r, g, b, a);
	while (!keyboardWindow->asyncFunctionCompleted())
		__asm__("nop");
	return keyboardWindow->asyncOutput();
}

int keyboard::freeText(int x, int y, const char *toWrite, float size, int r, int g, int b, int a)
{
	if (keyboardWindow->writeText(toWrite, x, y, size, r, g, b, a) == nullptr)
		return -1;
	return 0;
}

int keyboard::setKeyboardBGImg(const char *src)
{

	if (inMainThread)
		return keyboardWindow->setbackgroundImage(src);
	// else request async
	keyboardWindow->requestSetbackgroundImage(src);
	while (!keyboardWindow->asyncFunctionCompleted())
		__asm__("nop");
	return keyboardWindow->asyncOutput();
}

int keyboard::loadVideo(const char *filename, int x, int y, int w, int h)
{
	return keyboardWindow->loadVideo(filename, x, y, w, h);
}

vector<string> keyboard::splitPreserveQuotes(const string &str)
{
	vector<string> words;
	string currentWord;
	bool inQuotes = false;

	for (int i = 0; i < str.size(); i++)
	{
		char c = str[i];
		if (c == '"')
		{
			inQuotes = !inQuotes;
		}
		else if ((c == ' ' || c == '\t') && !inQuotes)
		{
			// split outside of quotes
			if (!currentWord.empty())
			{
				words.push_back(currentWord);
				currentWord.clear();
			}
		}
		else
		{
			currentWord += c;
		}
	}
	// push final word
	if (!currentWord.empty())
		words.push_back(currentWord);
	return words;
}

int keyboard::loadCustomShader(const char *vertexShader, const char *fragmentShader, int shaderType)
{
	if (inMainThread)
		return keyboardWindow->loadCustomShaderProgram(vertexShader, fragmentShader, shaderType);
	// else request async
	keyboardWindow->requestCustomShader(vertexShader, fragmentShader, shaderType);
	while (!keyboardWindow->asyncFunctionCompleted())
		__asm__("nop");
	return keyboardWindow->asyncOutput();
}

int keyboard::parseLine(string line)
{
	// cout << line << endl;

	// formatting:
	// comment					#
	// assign key				K	keyID	n	s
	// rectKey					R	keyID	n	n	n	n	f	f
	// circleKey					C	keyID	n	n	n	n	n
	// textureKey				T	keyID	n	s	f	f	o
	// freeRect					r	n	n	n	n	n	n	n	n
	// freeCircle				c	n	n	n	n	n	n	n	n
	// freeText					W	n	n	s	f	n	n	n	n
	// assignKeyFont				F	s
	// assignTextColor			t	n	n	n	n
	// assignBGImg				B	s
	// assignBGColor				b	n	n	n	n
	// loadShader for profile	S	s	s	n
	// loadVideo					V	s	n	n	n	n
	// key event

	// remove '\n'
	line.erase(remove(line.begin(), line.end(), '\n'), line.end());
	if (line.size() == 0)
		return 0; // blank line
	// split line into parts
	vector<string> parts;
	parts = splitPreserveQuotes(line);

	// check if first part is recognized (switch case)
	// check if number of arguments match
	// check if argument types parse correctly
	if (parts[0][0] == '#')
	{
		return 0; // comment
	}
	else if (parts[0] == "K")
	{ // assignKey(int keyID, int outputType, std::string outputString)
		cout << "Parts size " << parts.size() << "...\n";
		if (parts.size() != 4)
			return 2; // incorrect number of parameters
		// translate parameters
		int keyID;
		int outputType;
		try
		{
			keyID = stoi(parts[1]);
			outputType = stoi(parts[2]);
		}
		catch (const invalid_argument &e)
		{
			return 3; // unable to convert to correct type
		}
		// run function
		// cout << "running assignKey()" << endl;
		if (assignKey(keyID, outputType, parts[3]) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "R")
	{ // rectKey(int keyID, int r, int g, int b, int a, float width, float height);
		if (parts.size() != 8)
			return 2; // incorrect number of parameters
		// translate parameters
		int keyID, r, g, b, a;
		float width, height;
		try
		{
			keyID = stoi(parts[1]);
			r = stoi(parts[2]);
			g = stoi(parts[3]);
			b = stoi(parts[4]);
			a = stoi(parts[5]);
			width = stof(parts[6]);
			height = stof(parts[7]);
		}
		catch (const invalid_argument &e)
		{
			return 3; // unable to convert to correct type
		}
		// run function
		// cout << "running rectKey()" <<  endl;
		if (rectKey(keyID, r, g, b, a, width, height) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "C")
	{ // circleKey(int keyID, int radius, int segments, int r, int g, int b, int a);
		if (parts.size() != 8)
			return 2; // incorrect number of parameters
		// translate parameters
		int keyID, radius, segments, r, g, b, a;
		try
		{
			keyID = stoi(parts[1]);
			radius = stoi(parts[2]);
			segments = stoi(parts[3]);
			r = stoi(parts[4]);
			g = stoi(parts[5]);
			b = stoi(parts[6]);
			a = stoi(parts[7]);
		}
		catch (const invalid_argument &e)
		{
			return 3; // unable to convert to correct type
		}
		// run function
		// cout << "running circleKey()" << endl;
		if (circleKey(keyID, radius, segments, r, g, b, a) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "T")
	{ // textureKey(int keyID, int layoutType, string layoutString, float width, float height);
		if (!(parts.size() == 6 || parts.size() == 7))
			return 2; // incorrect number of parameters
		// translate parameters
		int keyID, layoutType, heldCondition;
		float width, height;
		try
		{
			keyID = stoi(parts[1]);
			layoutType = stoi(parts[2]);
			width = stof(parts[4]);
			height = stof(parts[5]);
			if (parts.size() == 7)
				heldCondition = stoi(parts[6]);
			else
				heldCondition = 0;
		}
		catch (const invalid_argument &e)
		{
			return 3; // unable to convert to correct type
		}
		// run function
		// cout << "running textureKey()" << endl;
		if (textureKey(keyID | heldCondition, layoutType, parts[3], width, height) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "r")
	{ // freeRect(int x, int y, int w, int h, int r, int g, int b, int a)
		if (parts.size() != 9)
			return 2; // incorrect number of parameters
		// translate parameters
		int x, y, w, h, r, g, b, a;
		try
		{
			x = stoi(parts[1]);
			y = stoi(parts[2]);
			w = stoi(parts[3]);
			h = stoi(parts[4]);
			r = stoi(parts[5]);
			g = stoi(parts[6]);
			b = stoi(parts[7]);
			a = stoi(parts[8]);
		}
		catch (const invalid_argument &e)
		{
			return 3; // unable to convert to correct type
		}
		// run function
		// cout << "running freeRect()" << endl;
		if (freeRect(x, y, w, h, r, g, b, a) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "c")
	{ // freeCircle(int x, int y, int radius, int segments, int r, int g, int b, int a)
		if (parts.size() != 9)
			return 2; // incorrect number of parameters
		// translate parameters
		int x, y, radius, segments, r, g, b, a;
		try
		{
			x = stoi(parts[1]);
			y = stoi(parts[2]);
			radius = stoi(parts[3]);
			segments = stoi(parts[4]);
			r = stoi(parts[5]);
			g = stoi(parts[6]);
			b = stoi(parts[7]);
			a = stoi(parts[8]);
		}
		catch (const invalid_argument &e)
		{
			return 3; // unable to convert to correct type
		}
		// run function
		// cout << "running freeCircle()" << endl;
		if (freeCircle(x, y, radius, segments, r, g, b, a) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "W")
	{ // freeText(int x, int y, const char* toWrite, float size, int r, int g, int b, int a)
		if (parts.size() != 9)
			return 2; // incorrect number of parameters
		// translate parameters
		int x, y, r, g, b, a;
		float size;

		try
		{
			x = stoi(parts[1]);
			y = stoi(parts[2]);
			size = stof(parts[4]);
			r = stoi(parts[5]);
			g = stoi(parts[6]);
			b = stoi(parts[7]);
			a = stoi(parts[8]);
		}
		catch (const invalid_argument &e)
		{
			return 3; // unable to convert to correct type
		}
		// run function
		// cout << "running freeText()" << endl;
		if (freeText(x, y, parts[3].c_str(), size, r, g, b, a) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "F")
	{ // assignKeyFont(const char* fontname)
		if (parts.size() != 2)
			return 2; // incorrect number of parameters
		// run function
		// cout << "running assignKeyFont()" << endl;
		if (assignKeyFont(parts[1].c_str()) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "t")
	{ // assignTextColor(int r, int g, int b, int a)
		if (parts.size() != 5)
			return 2; // incorrect number of parameters
		// translate parameters
		int r, g, b, a;

		try
		{
			r = stoi(parts[1]);
			g = stoi(parts[2]);
			b = stoi(parts[3]);
			a = stoi(parts[4]);
		}
		catch (const invalid_argument &e)
		{
			return 3; // unable to convert to correct type
		}
		// run function
		// cout << "running assignTextColor()"<< endl;
		if (assignTextColor(r, g, b, a) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "B")
	{ // setKeyboardBGImg(const char* txt)
		if (parts.size() != 2)
			return 2; // incorrect number of parameters
		// run function
		// cout << "running setKeyboardBGImg()"<< endl;
		if (setKeyboardBGImg(parts[1].c_str()) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "b")
	{ // assignKeyboardBackgroundColor(int r, int g, int b, int a)
		if (parts.size() != 5)
			return 2; // incorrect number of parameters
		// translate parameters
		int r, g, b, a;
		try
		{
			r = stoi(parts[1]);
			g = stoi(parts[2]);
			b = stoi(parts[3]);
			a = stoi(parts[4]);
		}
		catch (const invalid_argument &e)
		{
			return 3; // unable to convert to correct type
		}
		// run function
		// cout << "running assignKeyboardBackgroundColor()"<< endl;
		if (assignKeyboardBackgroundColor(r, g, b, a) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "S")
	{ // loadCustomShader(const char* vertexShader, const char* fragmentShader, int shaderType)
		if (parts.size() != 4)
			return 2; // incorrect number of parameters
		// translate parameters
		int shaderType;
		try
		{
			shaderType = stoi(parts[3]);
		}
		catch (const invalid_argument &e)
		{
			return 3; // unable to convert to correct type
		}
		// run function
		// cout << "running loadCustomShader()"<< endl;
		if (loadCustomShader(parts[1].c_str(), parts[2].c_str(), shaderType) != 0)
			return 4; // error running function
	}
	else if (parts[0] == "V")
	{ // loadVideo(const char* filename, int x, int y, int w, int h)
		if (parts.size() != 6)
			return 2; // incorrect number of parameters
		// translate parameters
		int x, y, w, h;
		try
		{
			x = stoi(parts[2]);
			y = stoi(parts[3]);
			w = stoi(parts[4]);
			h = stoi(parts[5]);
		}
		catch (const invalid_argument &e)
		{
			return 3; // unable to convert to correct type
		}
		// run function
		// cout << "running loadVideo()"<< endl;
		if (loadVideo(parts[1].c_str(), x, y, w, h) != 0)
			return 4; // error running function
	}
	else
	{
		return 1; // argument not recognized
	}

	// clear memory:
	parts.clear();
	parts.shrink_to_fit();
	return 0;
}