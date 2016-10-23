#pragma once
#include "Input.h"
#include <dinput.h>

class WindowsInput : public Input
{
private:
	LPDIRECTINPUT8 m_pDirectInput;
	HWND m_hWnd;
public:
	WindowsInput(HWND hWnd);
	LPDIRECTINPUT8 GetDirectInput();
	HWND GetHWnd();
	virtual bool Init() override;
};
