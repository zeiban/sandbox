#pragma once

#include <string>
#include <d3d11.h>

#include "Texture.h"

class Texture2D : public Texture
{
public:
	Texture2D();
	bool Create(ID3D11Device*, std::wstring);
	ID3D11ShaderResourceView* const *GetTexture(void);
	void Release();
private:
	ID3D11ShaderResourceView* m_pTexture;
};