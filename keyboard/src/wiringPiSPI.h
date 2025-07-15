#pragma once

#define SPI_CHANNEL_0 0
#define SPI_CHANNEL_1 1

inline int wiringPiSPISetup(int channel, int speed){return 0;}

inline int wiringPiSPIDataRW(int channel, unsigned char *data, int len){


    for(int i = 0; i< len; ++i){
        data[i] = data[i];
    }
    return len;
}