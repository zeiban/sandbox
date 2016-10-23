#include "WindowsKeyboard.h"
#include "WindowsInput.h"
#include <Windows.h>

WindowsInput::WindowsInput(HWND hWnd) : Input()
{
	m_hWnd = hWnd;
}
HWND WindowsInput::GetHWnd()
{
	return m_hWnd;
}

bool WindowsInput::Init()
{
	Input::Init();
	HRESULT hr = DirectInput8Create(GetModuleHandle(0), DIRECTINPUT_VERSION, IID_IDirectInput8, (void**)&m_pDirectInput, 0);

	if (FAILED(hr))
	{
		return false;
	}

	if (!AddInputDevice(new WindowsKeyboard(*this)))
	{
		return false;
	}
}
LPDIRECTINPUT8 WindowsInput::GetDirectInput()
{
	return m_pDirectInput;
}
