#pragma once
#include <string>
#include <vector>

#include <d3d11.h>
#include <DirectXMath.h>

using namespace DirectX;

class Shader
{
public:
	struct Binding
	{
		std::string name;
		int slot;
		int offset;
	};
	struct cbPerObject
	{
		XMMATRIX  WVP;
	};
	Shader();
	void Create(ID3D11Device* pDevice, std::wstring, std::wstring);
	void Destroy(void);
	void Render(ID3D11DeviceContext* pDeviceContext, const cbPerObject& buffer);
	//Binding* GetParameterBind(const std::string);
protected:
	std::vector<Binding> m_bindings;
	ID3D10Blob* Compile(std::wstring, std::string);
	ID3D11VertexShader* m_pVertexShader;
	ID3D11PixelShader* m_pPixelShader;
	ID3D11InputLayout* m_pInputLayout;
	ID3D11SamplerState* m_samplerState;
	ID3D11Buffer* m_pBuffer;
};