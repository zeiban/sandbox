#include "AABB.h"

AABB::AABB(const Vector3 &min, const Vector3 &max)
{
	this->min = min;
	this->max = max;
}
AABB::AABB(const Vector3 &position, const double &size)
{
	min = position - size;
	max = position + size;
}
