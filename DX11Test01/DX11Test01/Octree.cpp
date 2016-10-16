#include "Octree.h"

OctreeNode::OctreeNode(OctreeNode* pParent, Vector3 position, double size, int depth)
{
	double halfSize = size * 0.5;
	int childDepth = depth - 1;

	this->m_parent = pParent;
	this->m_size = size;
	this->m_center = position;
	
	if(depth > 0 )
	{ 
		m_children[0] = new OctreeNode(this, Vector3(position.x + halfSize, position.y + halfSize, position.z + halfSize), halfSize, childDepth);
		m_children[1] = new OctreeNode(this, Vector3(position.x + halfSize, position.y - halfSize, position.z + halfSize), halfSize, childDepth);
		m_children[2] = new OctreeNode(this, Vector3(position.x - halfSize, position.y + halfSize, position.z + halfSize), halfSize, childDepth);
		m_children[3] = new OctreeNode(this, Vector3(position.x - halfSize, position.y - halfSize, position.z + halfSize), halfSize, childDepth);
		m_children[4] = new OctreeNode(this, Vector3(position.x + halfSize, position.y + halfSize, position.z - halfSize), halfSize, childDepth);
		m_children[5] = new OctreeNode(this, Vector3(position.x + halfSize, position.y - halfSize, position.z - halfSize), halfSize, childDepth);
		m_children[6] = new OctreeNode(this, Vector3(position.x - halfSize, position.y + halfSize, position.z - halfSize), halfSize, childDepth);
		m_children[7] = new OctreeNode(this, Vector3(position.x - halfSize, position.y - halfSize, position.z - halfSize), halfSize, childDepth);
	}
}