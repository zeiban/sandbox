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

struct InputEventListener
{
	virtual void OnInputEvent(const InputEvent& event) = 0;
};


class Input
{
private:
	std::vector<InputDevice*> m_InputDevices;
	std::vector<InputEventListener*> m_InputEventListeners;
public:
	virtual bool Init();
	virtual void Update();
	bool AddInputDevice(InputDevice * pDevice);
	void ProcessInputEvent(const InputEvent& event);
	void AddInputListener(InputEventListener* pInputListener);
	void RemoveInputListener(InputEventListener* pInputListener);
};
