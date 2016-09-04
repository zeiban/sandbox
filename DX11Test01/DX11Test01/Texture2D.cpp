#include <WICTextureLoader.h>

#include "Texture2D.h"

using namespace DirectX;

Texture2D::Texture2D()
{
	m_pTexture = 0;
}

bool Texture2D::Create(ID3D11Device* pDevice, std::wstring filename)
{
	HRESULT hr;
	hr = CreateWICTextureFromFile(pDevice, filename.c_str(), NULL, &m_pTexture, NULL);
	if (FAILED(hr))
	{
		return false;
	}

	return true;
}
ID3D11ShaderResourceView* const *Texture2D::GetTexture(void)
{
	return &m_pTexture;
}

void Texture2D::Release()
{
	if (m_pTexture != NULL)
	{
		m_pTexture->Release();
	}
}