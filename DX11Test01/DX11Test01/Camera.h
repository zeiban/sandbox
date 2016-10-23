#pragma once

#include "Matrix4.h"
#include "Transform.h"

class Camera : public Transform
{
private:
	float nearPlane;
	float farPlane;
	float fieldOfView;
	Matrix4 m_projectionMatrix;
public:
	Camera();
	const Matrix4& GetProjectionMatrix(void);
	void SetProjectionMatrix(const Matrix4& projectionMatrix);
};

inline const Matrix4& Camera::GetProjectionMatrix(void)
{
	return m_projectionMatrix;
}

inline void Camera::SetProjectionMatrix(const Matrix4& projectionMatrix)
{
	m_projectionMatrix = projectionMatrix;
}
