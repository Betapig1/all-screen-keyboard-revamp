programName = keyboard

build:
	g++ src/main.cpp src/keyboard.cpp src/readHallEffect.cpp src/graphics.cpp src/text.cpp src/shader.cpp src/texture.cpp src/bluetooth.cpp src/physicalLayout.cpp -o ${programName} -lSDL2 -lSDL2_image -lSDL2_ttf -lGLESv2 -lzmq -lavutil -lavformat -lavcodec -lswscale -lswresample
	@echo "Build Finished"

run:
	./${programName}

clean:
	-rm ${programName}
	-rm graphicsTest
	-rm keyTest
	@echo "Clean Finished"

keyTest:
	g++ src/keyTest.cpp src/readHallEffect.cpp -o keyTest -lSDL2
	./keyTest
	-rm keyTest

graphicsTest:
	g++ src/graphics.cpp src/shader.cpp src/texture.cpp -o graphicsTest -lSDL2 -lSDL2_image -lSDL2_ttf -lGLESv2
	./graphicsTest
	-rm graphicsTest
	

py:
	python src/bluetooth/gattServer.py