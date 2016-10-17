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
	void SetPosition(const Vector3& position);
};

inline void Camera::SetPosition(const Vector3& v)
{
	position = v;
}
inline const Matrix4& Camera::GetWorldMatrix()
{
	Matrix4 worldMatrix = Matrix4(rotation) * Matrix4(position);
	return worldMatrix;
}
