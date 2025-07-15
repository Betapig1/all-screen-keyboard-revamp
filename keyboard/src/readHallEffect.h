#include <stdio.h>
#include "wiringPi.h"
#include "wiringPiSPI.h"
#include <unistd.h>

class hallEffectReader {
public:
	bool initSPI(int chanel, int speed, int GPIO1, int GPIO2, int GPIO3, int GPIO4);
	int readHallEffectSensor(int numberSensor);

private:
	int chipSelPin0;
	int chipSelPin1;
	int chipSelPin2;
	int chipSelPin3;
	int SPIchannel;
	void selectChipNumber(int chipNumber);
	void deselectChipNumber(int chipNumber);
};