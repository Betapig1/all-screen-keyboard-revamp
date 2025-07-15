#pragma once


#define INPUT 0
#define OUTPUT 1
#define LOW 0
#define HIGH 1

inline int wiringPiSetup(){return 0;}


inline void pinMode(int pin, int mode) {}
inline void digitalWrite(int pin, int value) {}
inline int digitalRead(int pin) {return 0;}
inline void pullUpDnControl(int pin, int pud) {}

inline void delay(unsigned int howLong){}
inline void delayMicroseconds(unsigned int howLong){}
