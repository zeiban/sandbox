#include "Material.h"

void Material::Create(Shader* pShader, Texture* pTexture)
{
	m_pShader = pShader;
	m_pTexture = pTexture;
}

Texture* Material::GetTexture(void)
{
	return m_pTexture;
}

Shader* Material::GetShader(void)
{
	return m_pShader;
}

void Material::Render(void)
{

}
