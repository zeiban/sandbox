#pragma once

#include "Vector3.h"

struct Quaternion
{
	double x, y, z, w;
	Quaternion();
	Quaternion(double x, double y, double z, double w);
	Quaternion(const const Vector3& axis, double angle);
};

inline Quaternion::Quaternion() :
	x(0.0),
	y(0.0),
	z(0.0),
	w(1.0)
{}

inline Quaternion::Quaternion(double x, double y, double z, double w) :
	x(x),
	y(y),
	z(z),
	w(w)
{}

inline Quaternion::Quaternion(const const Vector3& axis, double angle)
{
}

