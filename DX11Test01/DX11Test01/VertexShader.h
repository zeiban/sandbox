#include <string>

#include <d3d11.h>

#include "Shader.h"

class VertexShader : public Shader
{
private:
	ID3D11VertexShader* m_pVertexShader;
public:
	VertexShader();
	bool Create(ID3D11Device*, std::wstring);
	ID3D11VertexShader* GetVertexShader();
	void Release();
};