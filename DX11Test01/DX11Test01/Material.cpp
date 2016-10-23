#include "Material.h"

void Material::Create(ID3D11Device* pDevice, Shader* pShader, Texture2D* pTexture)
{
	HRESULT hr;

	m_pShader = pShader;
	m_pTexture = pTexture;

}
void Material::Destroy(void)
{
}

Texture* Material::GetTexture(void)
{
	return m_pTexture;
}

Shader* Material::GetShader(void)
{
	return m_pShader;
}

void Material::Render(ID3D11DeviceContext* pDeviceContext, const XMMATRIX& world, const XMMATRIX& view, const XMMATRIX& projection)
{
	Shader::cbPerObject buffer;
	buffer.WVP = XMMatrixTranspose(world * view * projection);
//	buffer.WVP = world * view * projection;
	m_pShader->Render(pDeviceContext, buffer);
	pDeviceContext->PSSetShaderResources(0, 1, m_pTexture->GetTexture());
}

void Material::SetMatrix(std::wstring name, const XMMATRIX& matrix)
{
}
