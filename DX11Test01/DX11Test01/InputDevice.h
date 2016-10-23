#pragma once

// #include "Input.h"
class Input;

class InputDevice
{
public:
	InputDevice(Input& input);
	virtual bool Init();
	virtual void Update() = 0;
private:
	Input& m_input;
};
