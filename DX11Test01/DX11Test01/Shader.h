#pragma once
#include <string>

#include <d3d11.h>

class Shader
{
public:
	Shader();
	void Create(ID3D11Device* pDevice, std::wstring, std::wstring);
	void Render(ID3D11DeviceContext*);
protected:
	ID3D10Blob* Compile(std::wstring, std::string);
	ID3D11VertexShader* m_pVertexShader;
	ID3D11PixelShader* m_pPixelShader;
	ID3D11InputLayout* m_pInputLayout;
	ID3D11SamplerState* m_samplerState;
};