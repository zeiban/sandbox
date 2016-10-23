#pragma once

#include <vector>
#include "InputDevice.h"

class Input
{
private:
	std::vector<InputDevice*> m_InputDevices;
public:
	virtual bool Init();
	virtual void Update();
	bool AddInputDevice(InputDevice * pDevice);
};
