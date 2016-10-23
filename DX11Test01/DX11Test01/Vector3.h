#pragma once

#include <cmath>

struct Vector3
{
	double x, y, z;
	Vector3();
	Vector3(double x, double y, double z);
	Vector3 operator+(const double& scalar) const;
	Vector3& operator+=(const double& scalar);
	Vector3 operator+(const Vector3& v) const;
	Vector3& operator+=(const Vector3& v);
	Vector3 operator-(const double& scalar) const;
	Vector3& operator-=(const double& scalar);
	Vector3 operator*(const double& scalar) const;
	Vector3& operator*=(const double& scalar);
	double Length();
	Vector3& Normalize();
	static const Vector3 RIGHT;
	static const Vector3 UP;
	static const Vector3 FORWARD;
};

inline Vector3::Vector3() : x(0.0), y(0.0), z(0.0)
{}
inline Vector3::Vector3(double x, double y, double z) : x(x), y(y), z(z)
{}

inline Vector3 Vector3::operator+(const double& scalar) const
{
	return Vector3(this->x + scalar, this->y + scalar, this->z + scalar);
}

inline Vector3& Vector3::operator+=(const double& scalar)
{
	return *this + scalar;
};

inline Vector3 Vector3::operator+(const Vector3& v) const
{
	return Vector3(this->x + v.x, this->y + v.y, this->z + v.z);
}

inline Vector3& Vector3::operator+=(const Vector3& v)
{
	return *this = (*this + v);
}

inline Vector3 Vector3::operator-(const double& scalar) const
{
	return Vector3(this->x - scalar, this->y - scalar, this->z - scalar);
}

inline Vector3& Vector3::operator-=(const double& scalar)
{
	return *this * scalar;
};

inline Vector3 Vector3::operator*(const double& scalar) const
{
	return Vector3(x * scalar, y * scalar, z * scalar);
}

inline Vector3& Vector3::operator*=(const double& scalar)
{
	return *this = (*this * scalar);
};


inline double Vector3::Length()
{
	return std::sqrt(x * x + y * y + z * z);
};

inline 	Vector3& Vector3::Normalize()
{
	*this *= Length();
	
};
