
#include "WindowsInputDevice.h"

WindowsInputDevice::WindowsInputDevice(WindowsInput& input, GUID guid) 
	: InputDevice(input), m_WindowsInput(input), m_pDevice(0), m_guid(guid)
{
}

bool WindowsInputDevice::CreateDirectInputDevice(LPCDIDATAFORMAT dataFormat, DWORD cooplevel, DWORD dwBufferSize)
{
	HRESULT hr;
	
	hr = m_WindowsInput.GetDirectInput()->CreateDevice(m_guid, &m_pDevice, 0);
	if (FAILED(hr))
	{
		return false;
	}

	hr = m_pDevice->SetDataFormat(dataFormat);
	if (FAILED(hr))
	{
		return false;
	}

	hr = m_pDevice->SetCooperativeLevel(m_WindowsInput.GetHWnd(), cooplevel);
	if (FAILED(hr))
	{
		return false;
	}
	
	DIPROPDWORD dipdw = { { sizeof(DIPROPDWORD), sizeof(DIPROPHEADER), 0, DIPH_DEVICE }, dwBufferSize };
	hr = m_pDevice->SetProperty(DIPROP_BUFFERSIZE, &dipdw.diph);
	if (FAILED(hr))
	{
		return false;
	}
	return true;
}
LPDIRECTINPUTDEVICE8 WindowsInputDevice::GetDirectInputDevice() const
{
	return m_pDevice;
}

bool WindowsInputDevice::Acquire()
{
	return (m_pDevice && SUCCEEDED(m_pDevice->Acquire()));
}

bool WindowsInputDevice::Unacquire()
{
	return (m_pDevice && SUCCEEDED(m_pDevice->Unacquire()));
}