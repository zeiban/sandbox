#pragma once

#include "Shader.h"
#include "Texture.h"

class Material
{
private:
	Shader* m_pShader;
	Texture* m_pTexture;
	bool m_bTransparent;
public:
	void Create(Shader* pShader, Texture* pTexture);
	Texture* GetTexture(void);
	Shader* GetShader(void);
	void Render(void);
	void SetMatrix(std::wstring name, const XMMATRIX& matrix)
};