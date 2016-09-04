#pragma once

#include "Shader.h"
#include "Texture.h"

class Material
{
private:
	Shader* m_pShader;
	Texture* m_pTexture;
	bool m_bTransparent;
};