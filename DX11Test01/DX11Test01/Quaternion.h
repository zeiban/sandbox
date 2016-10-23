#pragma once

#include "Vector3.h"

struct Quaternion
{
	double x, y, z, w;
	Quaternion();
	Quaternion(double x, double y, double z, double w);
	Quaternion(const const Vector3& axis, double angle);
	Quaternion operator*(const const Quaternion& q) const;
	Quaternion& operator*=(const const Quaternion& q);
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
	const float fHalfAngle = 0.5f*angle;
	const float fSin = sinf(fHalfAngle);
	w = cosf(fHalfAngle);
	x = fSin*axis.x;
	y = fSin*axis.y;
	z = fSin*axis.z;
}

inline Quaternion Quaternion::operator*(const Quaternion& q) const
{
	Quaternion tmp;
	tmp.w = (q.w * w) - (q.x * x) - (q.y * y) - (q.z * z);
	tmp.x = (q.w * x) + (q.x * w) + (q.y * z) - (q.z * y);
	tmp.y = (q.w * y) + (q.y * w) + (q.z * x) - (q.x * z);
	tmp.z = (q.w * z) + (q.z * w) + (q.x * y) - (q.y * x);
	return tmp;
}
inline Quaternion& Quaternion::operator*=(const Quaternion& q)
{
	return (*this = q * (*this));
}

