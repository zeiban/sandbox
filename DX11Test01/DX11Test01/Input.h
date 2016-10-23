#pragma once

#include <vector>
#include "InputDevice.h"

enum InputDeviceType
{
	Mouse,
	Keyboard
};

struct InputMap
{

};
enum InputId
{
	A,
	S,
	D,
	W,
	S,
	LEFT,
	RIGHT,
	UP,
	DOWN,
	Mouse1,
	Mouse2,
	MouseX,
	MouseY
};

enum InputState
{
	Pressed,
	Released,
	Changed
};

struct InputEvent
{

	InputDeviceType type;
	InputState state;
	InputId id;
	float value;
	InputEvent() {}
};

class Input
{
private:
	std::vector<InputDevice*> m_InputDevices;
public:
	virtual bool Init();
	virtual void Update();
	bool AddInputDevice(InputDevice * pDevice);
};
