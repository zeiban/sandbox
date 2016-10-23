#include "InputDevice.h"

InputDevice::InputDevice(Input& input) : m_input(input)
{

}

bool InputDevice::Init()
{
	return true;
}