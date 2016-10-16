#include "Mesh.h"

Mesh::Mesh(const std::vector<Vertex>& vertices, const std::vector<DWORD>& indices)
{
	m_vertices = vertices;
	m_indices = indices;
}

void Mesh::Create(ID3D11Device* pDevice)
{
	HRESULT hr;
	if (m_pVertexBuffer == NULL)
	{
		D3D11_BUFFER_DESC vertexBufferDesc;
		ZeroMemory(&vertexBufferDesc, sizeof(vertexBufferDesc));

		vertexBufferDesc.Usage = D3D11_USAGE_DEFAULT;
		vertexBufferDesc.ByteWidth = sizeof(Vertex) * m_vertices.size();
		vertexBufferDesc.BindFlags = D3D11_BIND_VERTEX_BUFFER;
		vertexBufferDesc.CPUAccessFlags = 0;
		vertexBufferDesc.MiscFlags = 0;

		D3D11_SUBRESOURCE_DATA vertexBufferData;
		ZeroMemory(&vertexBufferData, sizeof(vertexBufferData));

		vertexBufferData.pSysMem = &m_vertices[0];

		hr = pDevice->CreateBuffer(&vertexBufferDesc, &vertexBufferData, &m_pVertexBuffer);
		if (hr != S_OK)
		{
			MessageBox(nullptr , L"dasdad", L"RTTOT", MB_OK);
		}

	}

	if (m_pIndexBuffer == NULL)
	{
		D3D11_BUFFER_DESC indexBufferDesc;
		ZeroMemory(&indexBufferDesc, sizeof(indexBufferDesc));

		indexBufferDesc.Usage = D3D11_USAGE_DEFAULT;
		indexBufferDesc.ByteWidth = sizeof(DWORD) * m_indices.size();
		indexBufferDesc.BindFlags = D3D11_BIND_INDEX_BUFFER;
		indexBufferDesc.CPUAccessFlags = 0;
		indexBufferDesc.MiscFlags = 0;

		D3D11_SUBRESOURCE_DATA indexSubrecourceData;
		ZeroMemory(&indexSubrecourceData, sizeof(indexSubrecourceData));
		indexSubrecourceData.pSysMem = &m_indices[0];

		hr = pDevice->CreateBuffer(&indexBufferDesc, &indexSubrecourceData, &m_pIndexBuffer);

		if (hr != S_OK)
		{
			MessageBox(nullptr, L"dasdad", L"RTTOT", MB_OK);
		}
	}
}
void Mesh::Render(ID3D11DeviceContext* pDeviceContext)
{
	UINT stride = sizeof(Vertex);
	UINT offset = 0;
	pDeviceContext->IASetVertexBuffers(0, 1, &m_pVertexBuffer, &stride, &offset);
	if (m_pIndexBuffer != NULL)
	{
		pDeviceContext->IASetIndexBuffer(m_pIndexBuffer, DXGI_FORMAT_R32_UINT, 0);
	}
	pDeviceContext->IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_TRIANGLELIST);
}
void Mesh::Destroy(void)
{
	if (m_pVertexBuffer != NULL) m_pVertexBuffer->Release();
	if (m_pIndexBuffer != NULL) m_pIndexBuffer->Release();

}
Mesh* Mesh::Terrain(void)
{
	int size = 32;
	std::vector<Vertex> vertices;
	std::vector<DWORD> indices;

	for (int y = 0; y < size +1; y++)
	{
		for (int x = 0; x < size +1; x++)
		{
			vertices.push_back(Vertex(x * 8, 0.0f, y * 8, 0.0f, 1.0f, 0.0f, x * 8, y * 8 ));
		}
	}

	for (int y = 0; y < size; y++)
	{
		for (int x = 0; x < size; x++)
		{
			int v1 = x + y * (size + 1);
			int v2 = v1 + 1;
			int v3 = v1 + size + 1;
			int v4 = v1 + size + 2;

			indices.push_back(v1);
			indices.push_back(v3);
			indices.push_back(v2);

			indices.push_back(v3);
			indices.push_back(v4);
			indices.push_back(v2);
		}
	}

	return new Mesh(vertices, indices);
}

Mesh* Mesh::Cube(void)
{
	std::vector<Vertex> vertices({
		// Front Face
		Vertex(-1.0f, -1.0f, -1.0f, 0.0f, 0.0f, -1.0f, 0.0f, 1.0f),
		Vertex(-1.0f,  1.0f, -1.0f, 0.0f, 0.0f, -1.0f, 0.0f, 0.0f),
		Vertex(1.0f,  1.0f, -1.0f, 0.0f, 0.0f, -1.0f, 1.0f, 0.0f),
		Vertex(1.0f, -1.0f, -1.0f, 0.0f, 0.0f, -1.0f, 1.0f, 1.0f),

		// Back Face
		Vertex(-1.0f, -1.0f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f),
		Vertex(1.0f, -1.0f, 1.0f, 0.0f, 0.0f, 1.0f, 0.0f, 1.0f),
		Vertex(1.0f,  1.0f, 1.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f),
		Vertex(-1.0f,  1.0f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f),

		// Top Face
		Vertex(-1.0f, 1.0f, -1.0f, 0.0f, 1.0f, 0.0f, 0.0f, 1.0f),
		Vertex(-1.0f, 1.0f,  1.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f),
		Vertex(1.0f, 1.0f,  1.0f, 0.0f, 1.0f, 0.0f, 1.0f, 0.0f),
		Vertex(1.0f, 1.0f, -1.0f, 0.0f, 1.0f, 0.0f, 1.0f, 1.0f),

		// Bottom Face
		Vertex(-1.0f, -1.0f, -1.0f, 0.0f, -1.0f, 0.0f, 1.0f, 1.0f),
		Vertex(1.0f, -1.0f, -1.0f, 0.0f, -1.0f, 0.0f, 0.0f, 1.0f),
		Vertex(1.0f, -1.0f,  1.0f, 0.0f, -1.0f, 0.0f, 0.0f, 0.0f),
		Vertex(-1.0f, -1.0f,  1.0f, 0.0f, -1.0f, 0.0f, 1.0f, 0.0f),

		// Left Face
		Vertex(-1.0f, -1.0f,  1.0f, -1.0f, 0.0f, 0.0f, 0.0f, 1.0f),
		Vertex(-1.0f,  1.0f,  1.0f, -1.0f, 0.0f, 0.0f, 0.0f, 0.0f),
		Vertex(-1.0f,  1.0f, -1.0f, -1.0f, 0.0f, 0.0f, 1.0f, 0.0f),
		Vertex(-1.0f, -1.0f, -1.0f, -1.0f, 0.0f, 0.0f, 1.0f, 1.0f),

		// Right Face
		Vertex(1.0f, -1.0f, -1.0f, 1.0f, 0.0f, 0.0f, 0.0f, 1.0f),
		Vertex(1.0f,  1.0f, -1.0f, 1.0f, 0.0f, 0.0f, 0.0f, 0.0f),
		Vertex(1.0f,  1.0f,  1.0f, 1.0f, 0.0f, 0.0f, 1.0f, 0.0f),
		Vertex(1.0f, -1.0f,  1.0f, 1.0f, 0.0f, 0.0f, 1.0f, 1.0f),
	});
	std::vector<DWORD> indices({
		0,  1,  2,
		0,  2,  3,

		4,  5,  6,
		4,  6,  7,

		8,  9, 10,
		8, 10, 11,

		12, 13, 14,
		12, 14, 15,

		16, 17, 18,
		16, 18, 19,

		20, 21, 22,
		20, 22, 23
	});
	return new Mesh(vertices, indices);
}
