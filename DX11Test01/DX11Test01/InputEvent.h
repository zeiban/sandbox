#pragma once
struct InputEvent
{
	enum Type
	{
		
	};
	enum State
	{
		Pressed,
		Released
	};
	State state;
	float value;
};