#include <sstream>
#include <string>

#include "WindowsInput.h"
#include "WindowsKeyboard.h"

WindowsKeyboard::WindowsKeyboard(WindowsInput& input)
	: WindowsInputDevice(input, GUID_SysKeyboard)
{

}

bool WindowsKeyboard::Init()
{
	if (!CreateDirectInputDevice(&c_dfDIKeyboard, DISCL_NONEXCLUSIVE | DISCL_FOREGROUND, 32))
		return false;

	Acquire();
	return true;
}

void  WindowsKeyboard::Update()
{
	DIDEVICEOBJECTDATA data[256];
	DWORD dwCount = 256;
	HRESULT hr;

	hr = GetDirectInputDevice()->GetDeviceData(sizeof(DIDEVICEOBJECTDATA), data, &dwCount, 0);
	if (SUCCEEDED(hr))
	{
		for (DWORD i = 0; i < dwCount; i++)
		{
			int key = data[i].dwOfs;
			bool pressed = ((data[i].dwData & 0x80) != 0);
			std::wstringstream s;
			s << key << " " << pressed << std::endl;
			OutputDebugString(s.str().c_str());
			InputEvent event;
			if (pressed)
			{
				event.value = 1.0;
				event.state = InputState::Pressed;
			}
			else
			{
				event.value = 0;
				event.state = InputState::Released;
			}

			GetWindowsInput().ProcessInputEvent(event);
		}
	}
	else
	{
		if (hr == DIERR_INPUTLOST || hr == DIERR_NOTACQUIRED)
		{
			if (FAILED(GetDirectInputDevice()->Acquire()))
			{
			}
		}
	}
}