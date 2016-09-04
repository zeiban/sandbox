#include <D3Dcompiler.h>

#include "Shader.h"

Shader::Shader() {}

void Shader::Create(ID3D11Device* pDevice, std::wstring vsFilename, std::wstring psFilename)
{
	ID3D10Blob* pCode;
	HRESULT hr;
	pCode = Compile(vsFilename, "vs_5_0");
	hr = pDevice->CreateVertexShader(pCode->GetBufferPointer(), pCode->GetBufferSize(), NULL, &m_pVertexShader);
	
	D3D11_INPUT_ELEMENT_DESC layout[] =
	{
		{ "POSITION", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, D3D11_APPEND_ALIGNED_ELEMENT, D3D11_INPUT_PER_VERTEX_DATA, 0 },
		{ "NORMAL", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, D3D11_APPEND_ALIGNED_ELEMENT, D3D11_INPUT_PER_VERTEX_DATA, 0 },
		{ "TEXCOORD", 0, DXGI_FORMAT_R32G32_FLOAT, 0, D3D11_APPEND_ALIGNED_ELEMENT, D3D11_INPUT_PER_VERTEX_DATA, 0 }
	};
	int numElements = sizeof(layout) / sizeof(layout[0]);
	hr = pDevice->CreateInputLayout(layout, numElements, pCode->GetBufferPointer(), pCode->GetBufferSize(),
		&m_pInputLayout);

	pCode->Release();

	pCode = Compile(psFilename, "ps_5_0");
	hr = pDevice->CreatePixelShader(pCode->GetBufferPointer(), pCode->GetBufferSize(), NULL, &m_pPixelShader);
	pCode->Release();

	D3D11_SAMPLER_DESC sampDesc;
	ZeroMemory(&sampDesc, sizeof(sampDesc));
	sampDesc.Filter = D3D11_FILTER_MIN_MAG_MIP_LINEAR;
	sampDesc.AddressU = D3D11_TEXTURE_ADDRESS_WRAP;
	sampDesc.AddressV = D3D11_TEXTURE_ADDRESS_WRAP;
	sampDesc.AddressW = D3D11_TEXTURE_ADDRESS_WRAP;
	sampDesc.ComparisonFunc = D3D11_COMPARISON_NEVER;
	sampDesc.MinLOD = 0;
	sampDesc.MaxLOD = D3D11_FLOAT32_MAX;

	hr = pDevice->CreateSamplerState(&sampDesc, &m_samplerState);
}
void Shader::Render(ID3D11DeviceContext* pDeviceContext)
{
	pDeviceContext->IASetInputLayout(m_pInputLayout);
	pDeviceContext->VSSetShader(m_pVertexShader, NULL, 0);
	pDeviceContext->PSSetShader(m_pPixelShader, NULL, 0);
	pDeviceContext->PSSetSamplers(0, 1, &m_samplerState);
}

ID3D10Blob* Shader::Compile(std::wstring filename, std::string pTarget)
{
	HRESULT hr;
	ID3D10Blob* pCode;
	ID3D10Blob* pError;

	hr = D3DCompileFromFile(filename.c_str(), 0, 0, "main", pTarget.c_str(), 0, 0, &pCode, &pError);
	if (hr != S_OK)
	{
		if (pError)
		{
			OutputDebugStringA((char*)pError->GetBufferPointer());
			pError->Release();
		}

		if (pCode)
			pCode->Release();
	}
	return pCode;
}
