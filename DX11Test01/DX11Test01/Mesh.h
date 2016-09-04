#pragma once

#include <d3d11.h>
#include <DirectXMath.h>

#include <vector>

using namespace DirectX;


class Mesh
{
public:
	struct Vertex
	{
		Vertex() {}
		Vertex(float x, float y, float z, float nx, float ny, float nz, float u, float v)
			: position(x, y, z), normal(nx, ny, nz), uv(u, v) {}

		XMFLOAT3 position;
		XMFLOAT3 normal;
		XMFLOAT2 uv;
	};
	Mesh(const std::vector<Vertex>& vertices, const std::vector<DWORD>& indices);
	void Create(ID3D11Device* pDevice);
	void Render(ID3D11DeviceContext* pDeviceContext);
	void Destroy(void);
	static Mesh* Cube(void);
private:
	std::vector<Vertex> m_vertices;
	std::vector<DWORD> m_indices;
	ID3D11Buffer* m_pIndexBuffer;
	ID3D11Buffer* m_pVertexBuffer;
};
