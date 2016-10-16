#pragma once
#include <array>
#include "Vector3.h"
#include "AABB.h"

class OctreeNode
{
	OctreeNode* m_parent;
	std::array<OctreeNode*,8> m_children;
	Vector3 m_center;
	double m_size;
public:
	OctreeNode(OctreeNode* pParent, Vector3 position, double size, int depth);
	AABB GetAABB() const;
};

inline AABB OctreeNode::GetAABB() const
{
	return AABB(m_center, m_size);
}