#pragma once
#include <iostream> 

#include "Quaternion.h"

struct Matrix4
{
private:
	double m[4][4];
public:
	Matrix4();
	Matrix4(const Quaternion& q);
	Matrix4(const Vector3& v);
	const Vector3& GetRight(void);
	const Vector3& GetUp(void);
	const Vector3& GetForward(void);
	double operator()(const int row, const int col) const;
	const double operator[](const int index) const;
	Matrix4 Matrix4::operator*(const Matrix4& m) const;
	Matrix4& Matrix4::operator*=(const Matrix4& m);
};

inline Matrix4::Matrix4()
{
	m[0][0] = 1; m[0][1] = 0;  m[0][2] = 0;  m[0][3] = 0;
	m[1][0] = 0; m[1][1] = 1;  m[1][2] = 0;  m[1][3] = 0;
	m[2][0] = 0; m[2][1] = 0;  m[2][2] = 1;  m[2][3] = 0;
	m[3][0] = 0; m[3][1] = 0;  m[3][2] = 0;  m[3][3] = 1;
}

inline Matrix4::Matrix4(const Quaternion& q)
{
	double ww = q.w*q.w;
	double xx = q.x*q.x;
	double yy = q.y*q.y;
	double zz = q.z*q.z;

	m[0][0] = ww + xx - yy - zz;       m[0][1] = 2 * (q.x*q.y - q.w*q.z); m[0][2] = 2 * (q.x*q.z + q.w*q.y); m[0][3] = 0;
	m[1][0] = 2 * (q.x*q.y + q.w*q.z); m[1][1] = ww - xx + yy - zz;       m[1][2] = 2 * (q.y*q.z - q.w*q.x); m[1][3] = 0;
	m[2][0] = 2 * (q.x*q.z - q.w*q.y); m[2][1] = 2 * (q.y*q.z + q.w*q.x); m[2][2] = ww - xx - yy + zz;       m[2][3] = 0;
	m[3][0]	= 0;                       m[3][1] = 0;                       m[3][2] = 0;                       m[3][3] = 1;
}

inline Matrix4::Matrix4(const Vector3& v)
{
	m[0][0] = 1;	m[0][1] = 0;	m[0][2] = 0;	m[0][3] = 0;
	m[1][0] = 0;	m[1][1] = 1;	m[1][2] = 0;	m[1][3] = 0;
	m[2][0] = 0;	m[2][1] = 0;	m[2][2] = 1;	m[2][3] = 0;
	m[3][0] = v.x;	m[3][1] = v.y;  m[3][2] = v.z;  m[3][3] = 1;
}

inline Matrix4 Matrix4::operator*(const Matrix4& m2) const
{
	Matrix4 r;
	r.m[0][0] = m[0][0] * m2.m[0][0] + m[0][1] * m2.m[1][0] + m[0][2] * m2.m[2][0] + m[0][3] * m2.m[3][0];
	r.m[0][1] = m[0][0] * m2.m[0][1] + m[0][1] * m2.m[1][1] + m[0][2] * m2.m[2][1] + m[0][3] * m2.m[3][1];
	r.m[0][2] = m[0][0] * m2.m[0][2] + m[0][1] * m2.m[1][2] + m[0][2] * m2.m[2][2] + m[0][3] * m2.m[3][2];
	r.m[0][3] = m[0][0] * m2.m[0][3] + m[0][1] * m2.m[1][3] + m[0][2] * m2.m[2][3] + m[0][3] * m2.m[3][3];

	r.m[1][0] = m[1][0] * m2.m[0][0] + m[1][1] * m2.m[1][0] + m[1][2] * m2.m[2][0] + m[1][3] * m2.m[3][0];
	r.m[1][1] = m[1][0] * m2.m[0][1] + m[1][1] * m2.m[1][1] + m[1][2] * m2.m[2][1] + m[1][3] * m2.m[3][1];
	r.m[1][2] = m[1][0] * m2.m[0][2] + m[1][1] * m2.m[1][2] + m[1][2] * m2.m[2][2] + m[1][3] * m2.m[3][2];
	r.m[1][3] = m[1][0] * m2.m[0][3] + m[1][1] * m2.m[1][3] + m[1][2] * m2.m[2][3] + m[1][3] * m2.m[3][3];
	
	r.m[2][0] = m[2][0] * m2.m[0][0] + m[2][1] * m2.m[1][0] + m[2][2] * m2.m[2][0] + m[2][3] * m2.m[3][0];
	r.m[2][1] = m[2][0] * m2.m[0][1] + m[2][1] * m2.m[1][1] + m[2][2] * m2.m[2][1] + m[2][3] * m2.m[3][1];
	r.m[2][2] = m[2][0] * m2.m[0][2] + m[2][1] * m2.m[1][2] + m[2][2] * m2.m[2][2] + m[2][3] * m2.m[3][2];
	r.m[2][3] = m[2][0] * m2.m[0][3] + m[2][1] * m2.m[1][3] + m[2][2] * m2.m[2][3] + m[2][3] * m2.m[3][3];
	
	r.m[3][0] = m[3][0] * m2.m[0][0] + m[3][1] * m2.m[1][0] + m[3][2] * m2.m[2][0] + m[3][3] * m2.m[3][0];
	r.m[3][1] = m[3][0] * m2.m[0][1] + m[3][1] * m2.m[1][1] + m[3][2] * m2.m[2][1] + m[3][3] * m2.m[3][1];
	r.m[3][2] = m[3][0] * m2.m[0][2] + m[3][1] * m2.m[1][2] + m[3][2] * m2.m[2][2] + m[3][3] * m2.m[3][2];
	r.m[3][3] = m[3][0] * m2.m[0][3] + m[3][1] * m2.m[1][3] + m[3][2] * m2.m[2][3] + m[3][3] * m2.m[3][3];
	
	return r;
}

inline Matrix4& Matrix4::operator*=(const Matrix4& m)
{
	return *this * m;
};

inline double Matrix4::operator()(const int row, const int col) const
{
	return m[row][col];
}
