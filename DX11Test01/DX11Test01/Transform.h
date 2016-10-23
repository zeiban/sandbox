#pragma once

#include <vector>
#include "Vector3.h"
#include "Quaternion.h"

class Transform
{
private:
	Transform* m_pParent;
	std::vector<Transform*> m_children;
	Vector3 m_position;
	Quaternion m_rotation;
	Matrix4 m_localMatrix;
	Matrix4 m_worldMatrix;
public:
	Transform();
//	Transform(const Vector3& position, const Quaternion& rotation)
	Transform* GetRoot(void);
	Transform* GetChild(int index);
	Transform* GetParent(void);
	void SetParent(Transform* pParent);
	int GetChildCount(void);
	const Matrix4& GetWorldMatrix(void);
	const Matrix4& GetLocalMatrix(void);
	const Vector3& GetPosition(void);
	void SetPosition(const Vector3& position);
	const Quaternion& GetRotation(void);
	void SetRotation(const Quaternion& rotation);
	Vector3 Transform::GetRight(void) const;
	Vector3 GetUp(void) const;
	Vector3 GetForward(void) const;
	void Rotate(const Vector3& angles);
	void Translate(const Vector3& translation);
};

inline Transform::Transform()
{}

inline Transform* Transform::GetRoot(void)
{
	Transform* pParent = this;
	while (pParent->m_pParent != nullptr)
	{
		pParent = pParent->m_pParent;
	}
	return pParent;
}
inline Transform* Transform::GetParent(void)
{
	return m_pParent;
}

inline void Transform::SetParent(Transform* pParent)
{
	if (m_pParent != nullptr)
	{	
		std::vector<Transform*>::iterator iter;
		for (iter = m_pParent->m_children.begin(); iter != m_pParent->m_children.end(); iter++)
		{
			if (*iter == this)
			{
				iter = m_pParent->m_children.erase(iter);
				break;
			}
		}
	}
	m_pParent = pParent;
	pParent->m_children.push_back(this);
}

inline Transform* Transform::GetChild(int index)
{
	return m_children[index];
}

inline int Transform::GetChildCount(void)
{
	return m_children.size();
}

inline const Vector3& Transform::GetPosition(void)
{
	return m_position;
}

inline void Transform::SetPosition(const Vector3& position)
{
	m_position = position;
}

inline const Quaternion& Transform::GetRotation(void)
{
	return m_rotation;
}

inline void Transform::SetRotation(const Quaternion& rotation)
{
	m_rotation = rotation;
}

inline const Matrix4& Transform::GetWorldMatrix(void)
{
	
	if (m_pParent != nullptr)
	{
		m_worldMatrix = m_pParent->m_worldMatrix * GetLocalMatrix();
	}
	else
	{
		m_worldMatrix = GetLocalMatrix();
	}
	return m_worldMatrix;

}

inline const Matrix4& Transform::GetLocalMatrix(void)
{
	m_localMatrix = Matrix4(m_position) * Matrix4(m_rotation);
	return m_localMatrix;
}
inline Vector3 Transform::GetRight(void) const
{
	return Vector3(m_localMatrix(0, 0), m_localMatrix(1, 0), m_localMatrix(2, 0));
}

inline Vector3 Transform::GetUp(void) const
{
	return Vector3(m_localMatrix(0, 1), m_localMatrix(1, 1), m_localMatrix(2, 1));
}

inline Vector3 Transform::GetForward(void) const
{
	return Vector3(m_localMatrix(0, 2), m_localMatrix(1, 2), m_localMatrix(2, 2));
}

inline void Transform::Rotate(const Vector3& angles)
{
	m_rotation *= Quaternion(Vector3::RIGHT, angles.x) * Quaternion(Vector3::UP, angles.y) * Quaternion(Vector3::FORWARD, angles.z);
}

inline void Transform::Translate(const Vector3& translation)
{
	m_position += translation;
}
