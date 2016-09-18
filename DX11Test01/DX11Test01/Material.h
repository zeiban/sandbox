#pragma once

#include <DirectXMath.h>

#include "Shader.h"
#include "Texture2D.h"

using namespace DirectX;

class Material
{
private:
	Shader* m_pShader;
	Texture2D* m_pTexture;
	bool m_bTransparent;
public:

	void Create(ID3D11Device* pDevice, Shader* pShader, Texture2D* pTexture);
	void Destroy(void);
	Texture* GetTexture(void);
	Shader* GetShader(void);
	void Render(ID3D11DeviceContext* pDevice, const XMMATRIX& world, const XMMATRIX& view, const XMMATRIX& projection);
	void SetMatrix(std::wstring name, const XMMATRIX& matrix);
};