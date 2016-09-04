#include "VertexShader.h"

VertexShader::VertexShader()
{

}

bool VertexShader::Create(ID3D11Device* pDevice, std::wstring filename)
{
	HRESULT hr;
	ID3D10Blob* pCode = this->Compile(filename, "vs_5_0");
	if (pCode == NULL)
	{
		return false;
	}

	hr = pDevice->CreateVertexShader(pCode->GetBufferPointer(), pCode->GetBufferSize(), NULL, &m_pVertexShader);
	if (hr != S_OK)
	{
		return false;
	}

	pCode->Release();

	return true;
}

ID3D11VertexShader* VertexShader::GetVertexShader()
{
	return m_pVertexShader;
}

void VertexShader::Release()
{
	if (m_pVertexShader != NULL)
	{
		m_pVertexShader->Release();
	}
}
