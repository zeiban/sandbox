#include "Camera.h"

Camera::Camera() : 
	position(Vector3()), 
	rotation(Quaternion()), 
	nearPlane(0.3f), 
	farPlane(1000.0f)
{}
