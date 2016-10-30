#include <algorithm>

#include "Input.h"

bool Input::Init()
{
	return true;
}

void Input::Update()
{
	for (std::vector<InputDevice*>::iterator i = m_InputDevices.begin(); i != m_InputDevices.end(); ++i)
	{
		(*i)->Update();
	}
}

bool Input::AddInputDevice(InputDevice* pDevice)
{
	if (pDevice)
	{
		if (pDevice->Init())
		{
			m_InputDevices.push_back(pDevice);
			return true;
		}

	}
	return false;
}

void Input::ProcessInputEvent(const InputEvent& event)
{
	for (std::vector<InputEventListener*>::iterator i = m_InputEventListeners.begin(); i != m_InputEventListeners.end(); ++i)
	{
		(*i)->OnInputEvent(event);
	}
}

void Input::AddInputListener(InputEventListener* pInputListener)
{	
	std::vector<InputEventListener*>::iterator listener = std::find(m_InputEventListeners.begin(), m_InputEventListeners.end(), pInputListener);

	if (listener == m_InputEventListeners.end())
	{
		m_InputEventListeners.push_back(pInputListener);
	}
}

void Input::RemoveInputListener(InputEventListener* pInputListener)
{
}
