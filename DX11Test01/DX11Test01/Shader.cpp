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

	ID3D11ShaderReflection* pReflection = NULL;
	D3DReflect(pCode->GetBufferPointer(), pCode->GetBufferSize(), IID_ID3D11ShaderReflection, (void**)&pReflection);

	D3D11_SHADER_DESC sd;
	pReflection->GetDesc(&sd);
	ID3D11ShaderReflectionConstantBuffer* pBuffer = NULL;
	for (uint32_t b = 0; b < sd.ConstantBuffers; b++)
	{
		pBuffer = pReflection->GetConstantBufferByIndex(b);
		D3D11_SHADER_BUFFER_DESC sbd;
		pBuffer->GetDesc(&sbd);
		for (uint32_t v = 0; v < sbd.Variables; v++)
		{
			D3D11_SHADER_VARIABLE_DESC svd;
			ID3D11ShaderReflectionVariable* pVariable = pBuffer->GetVariableByIndex(v);
			pVariable->GetDesc(&svd);
			Binding binding;
			binding.name = svd.Name;
			binding.slot = b;
			binding.offset = svd.StartOffset;
			m_bindings.push_back(binding);
		}
	}

	D3D11_SHADER_INPUT_BIND_DESC sibd;
	for (int i = 0; i < sd.BoundResources; i++)
	{
		ZeroMemory(&sibd, sizeof(D3D11_SHADER_INPUT_BIND_DESC));
		pReflection->GetResourceBindingDesc(i, &sibd);
		if (sibd.Type == D3D10_SIT_TEXTURE)
		{
			Binding binding;
			binding.name = sibd.Name;
			binding.slot = sibd.BindPoint;
			m_bindings.push_back(binding);
		}
	}
	
	pReflection->Release();

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

	D3D11_BUFFER_DESC cbbd;
	ZeroMemory(&cbbd, sizeof(D3D11_BUFFER_DESC));

	cbbd.Usage = D3D11_USAGE_DEFAULT;
	cbbd.ByteWidth = sizeof(cbPerObject);
	cbbd.BindFlags = D3D11_BIND_CONSTANT_BUFFER;
	cbbd.CPUAccessFlags = 0;
	cbbd.MiscFlags = 0;

	hr = pDevice->CreateBuffer(&cbbd, NULL, &m_pBuffer);

}
void Shader::Destroy()
{
	if (m_pVertexShader != NULL) m_pVertexShader->Release();
	if (m_pPixelShader != NULL) m_pPixelShader->Release();
	if (m_pInputLayout != NULL) m_pInputLayout->Release();
	if (m_samplerState != NULL) m_samplerState->Release();
	if (m_pBuffer != NULL) m_pBuffer->Release();
}

void Shader::Render(ID3D11DeviceContext* pDeviceContext, const cbPerObject& buffer)
{
	pDeviceContext->UpdateSubresource(m_pBuffer, 0, NULL, &buffer, 0, 0);
	pDeviceContext->VSSetConstantBuffers(0, 1, &m_pBuffer);
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
