#pragma once

#include <cmath>

struct Vector3
{
	double x, y, z;
	Vector3();
	Vector3(double x, double y, double z);
	Vector3 operator+(const double& scalar) const;
	Vector3& operator+=(const double& scalar);
	Vector3 operator-(const double& scalar) const;
	Vector3& operator-=(const double& scalar);
	Vector3 operator*(const double& scalar) const;
	Vector3& operator*=(const double& scalar);
	double Length();
	Vector3& Normalize();
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
	return Vector3(this->x - scalar, this->y - scalar, this->z - scalar);
}

inline Vector3& Vector3::operator*=(const double& scalar)
{
	return *this * scalar;
};


inline double Vector3::Length()
{
	return std::sqrt(x * x + y * y + z * z);
};

inline 	Vector3& Vector3::Normalize()
{
	*this *= Length();
	
};
