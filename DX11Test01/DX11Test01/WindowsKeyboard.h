#pragma once

#include "WindowsInputDevice.h"

class WindowsKeyboard : public WindowsInputDevice
{
public:
	WindowsKeyboard(WindowsInput& input);
	virtual bool Init();
	virtual void Update();

};
