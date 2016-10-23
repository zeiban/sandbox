#pragma once
#include "InputDevice.h"
#include "WindowsInput.h"

class WindowsInputDevice : public InputDevice
{
public:
	WindowsInputDevice(WindowsInput& input, GUID guid);
	bool CreateDirectInputDevice(LPCDIDATAFORMAT dataFormat, DWORD cooplevel, DWORD dwBufferSize);
	LPDIRECTINPUTDEVICE8 GetDirectInputDevice() const;
protected:
	bool Acquire();
	bool Unacquire();

private:
	WindowsInput& m_WindowsInput;
	GUID m_guid;
	LPDIRECTINPUTDEVICE8 m_pDevice;
};