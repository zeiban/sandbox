#pragma once
#include "Vector3.h"

struct AABB
{
public:
	Vector3 min;
	Vector3 max;
	AABB(const Vector3 &min, const Vector3 &max);
	AABB(const Vector3 &position, const double &size);
};