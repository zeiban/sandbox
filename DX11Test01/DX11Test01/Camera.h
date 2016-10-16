#pragma once

#include "Matrix4.h"
#include "Vector3.h"
#include "Quaternion.h"

class Camera
{
private:
	Vector3 position;
	Quaternion rotation;
	float nearPlane;
	float farPlane;
	float fieldOfView;
public:
	Camera();
	const Matrix4& GetWorldMatrix();
	const Matrix4& GetProjectionMatrix();
};

inline const Matrix4& Camera::GetWorldMatrix()
{
	return m[row * 4 + col];
}