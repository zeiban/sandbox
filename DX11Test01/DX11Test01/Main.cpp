#include <windows.h>
#include <d3d11.h>
//#include <D3dx9math.h>
//#include <D3DX11async.h>
//#include <d3dx10.h>
//#include <xnamath.h>
#include <D3Dcompiler.h>
#include <DirectXMath.h>
#include <DDSTextureLoader.h>
#include <WICTextureLoader.h>
#include <string>
#include <fstream>
#include <iostream>

#include "Mesh.h"
#include "Material.h"
#include "Texture2D.h"
#include "VertexShader.h"
#include "Octree.h"
#include "Camera.h"

using namespace DirectX;

LPCTSTR WndClassName = L"firstwindow";    
HWND g_hWnd = NULL;
//VertexShader* g_pVertexShader = new VertexShader();
//PixelShader* g_pPixelShader = new PixelShader();

const int g_width = 800;
const int g_height = 600;
const int g_maxNumTextCharacters = 1024;

OctreeNode* g_pOctree;
Camera* g_pCamera;

IDXGISwapChain* g_swapChain;
ID3D11Device* g_d3d11Device;
ID3D11DeviceContext* g_d3d11DevCon;
ID3D11RenderTargetView* g_renderTargetView;
ID3D11RasterizerState* g_wireFrame;
ID3D11RasterizerState* g_solid;
ID3D11RasterizerState* g_CCWcullMode;
ID3D11RasterizerState* g_CWcullMode;
ID3D11RasterizerState* g_noCull;

ID3D11VertexShader* g_VS;
ID3D11PixelShader* g_PS;
ID3D11VertexShader* g_textVS;
ID3D11PixelShader* g_textPS;
ID3D10Blob* g_VS_Buffer;
ID3D10Blob* g_PS_Buffer;
ID3D10Blob* g_textVSBytecode;
ID3D10Blob* g_textPSBytecode;
ID3D11InputLayout* g_vertLayout;

Shader* g_pTextureShader = new Shader();

ID3D11Buffer* g_squareIndexBuffer;
ID3D11Buffer* g_squareVertBuffer;

ID3D11Buffer* g_textVertexBuffer;

ID3D11DepthStencilView* g_depthStencilView;
ID3D11Texture2D* g_depthStencilBuffer;

ID3D11Buffer* g_cbPerObjectBuffer;

ID3D11ShaderResourceView* g_cubesTexture;
ID3D11SamplerState* g_cubesTexSamplerState;

ID3D11BlendState* g_transparency;

XMMATRIX g_WVP;
XMMATRIX g_cube1World;
XMMATRIX g_cube2World; 
XMMATRIX g_camView;
XMMATRIX g_camProjection;

XMVECTOR g_camPosition;
XMVECTOR g_camTarget;
XMVECTOR g_camUp;

XMMATRIX g_rotation;
XMMATRIX g_scale;
XMMATRIX g_translation;
float rot = 0.01f;

Mesh* g_pMesh;
Mesh* g_pTerrain;
Material g_Material;
Texture2D* g_pTexture;
Shader* g_pShader;

struct PositionTexCoordVertex
{
	PositionTexCoordVertex() {}
	PositionTexCoordVertex(float x, float y, float z, float u, float v)
		: pos(x, y, z), texCoord(u, v) {}

	XMFLOAT3 pos;
	XMFLOAT2 texCoord;
};

struct TextVertex {
	TextVertex(float r, float g, float b, float a, float u, float v, float tw, float th, float x, float y, float w, float h) 
		: color(r, g, b, a), texCoord(u, v, tw, th), pos(x, y, w, h) {}
	XMFLOAT4 pos;
	XMFLOAT4 texCoord;
	XMFLOAT4 color;
};

struct cbPerObject
{
	DirectX::XMMATRIX  WVP;
};

//The input-layout description
D3D11_INPUT_ELEMENT_DESC g_layout[] =
{
	{ "POSITION", 0, DXGI_FORMAT_R32G32B32_FLOAT, 0, 0, D3D11_INPUT_PER_VERTEX_DATA, 0 },
	{ "TEXCOORD",    0, DXGI_FORMAT_R32G32_FLOAT, 0, 12, D3D11_INPUT_PER_VERTEX_DATA, 0 }
};

D3D11_INPUT_ELEMENT_DESC g_textInputLayout[] =
{
	{ "POSITION", 0, DXGI_FORMAT_R32G32B32A32_FLOAT, 0, 0, D3D11_INPUT_PER_INSTANCE_DATA, 1 },
	{ "TEXCOORD", 0, DXGI_FORMAT_R32G32B32A32_FLOAT, 0, 16, D3D11_INPUT_PER_INSTANCE_DATA, 1 },
	{ "COLOR", 0, DXGI_FORMAT_R32G32B32A32_FLOAT, 0, 32, D3D11_INPUT_PER_INSTANCE_DATA, 1 }
};
UINT g_numElements = ARRAYSIZE(g_layout);

struct Timer
{
	double timerFrequency = 0.0;
	long long lastFrameTime = 0;
	long long lastSecond = 0;
	double frameDelta = 0;
	int fps = 0;

	Timer()
	{
		LARGE_INTEGER li;
		QueryPerformanceFrequency(&li);

		// seconds
		//timerFrequency = double(li.QuadPart);

		// milliseconds
		timerFrequency = double(li.QuadPart) / 1000.0;

		// microseconds
		//timerFrequency = double(li.QuadPart) / 1000000.0;

		QueryPerformanceCounter(&li);
		lastFrameTime = li.QuadPart;
	}

	// Call this once per frame
	double GetFrameDelta()
	{
		LARGE_INTEGER li;
		QueryPerformanceCounter(&li);
		frameDelta = double(li.QuadPart - lastFrameTime) / timerFrequency;
		if (frameDelta > 0)
			fps = 1000 / frameDelta;
		lastFrameTime = li.QuadPart;
		return frameDelta;
	}
}; 

Timer g_timer;

struct FontChar
{
	int id;
	float u;
	float v;
	float width;
	float twidth;
	float height;
	float theight;
	float xoffset;
	float yoffset;
	float xadvance;
};

struct FontKerning
{
	int firstid;
	int secondid;
	float amount;
};

struct Font
{
	std::wstring name;
	int size;
	int toppadding;
	int rightpadding;
	int bottompadding;
	int leftpadding;
	int lineHeight;
	float baseHeight;
	int textureWidth;
	int textureHeight;
	std::wstring fontImage;
	int numCharacters;
	FontChar* CharList;
	int numKernings;
	FontKerning* KerningsList;

	// this will return the amount of kerning we need to use for two characters
	float GetKerning(wchar_t first, wchar_t second)
	{
		for (int i = 0; i < numKernings; ++i)
		{
			if ((wchar_t)KerningsList[i].firstid == first && (wchar_t)KerningsList[i].secondid == second)
				return KerningsList[i].amount;
		}
		return 0.0f;
	}

	// this will return a FontChar given a wide character
	FontChar* GetChar(wchar_t c)
	{
		for (int i = 0; i < numCharacters; ++i)
		{
			if (c == (wchar_t)CharList[i].id)
				return &CharList[i];
		}
		return nullptr;
	}
};

Font LoadFont(LPCWSTR filename)
{
	int windowHeight = 256;
	int windowWidth = 256;

	std::wifstream fs;
	fs.open(filename);
	Font font;
	std::wstring tmp;
	int startpos;

	fs >> tmp >> tmp; // info face="Arial"
	startpos = tmp.find(L"\"") + 1;
	font.name = tmp.substr(startpos, tmp.size() - startpos - 1);

	fs >> tmp; // size=73
	startpos = tmp.find(L"=") + 1;
	font.size = std::stoi(tmp.substr(startpos, tmp.size() - startpos));

	// bold, italic, charset, unicode, stretchH, smooth, aa, padding, spacing
	fs >> tmp >> tmp >> tmp >> tmp >> tmp >> tmp >> tmp; // bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 
														 // get padding
	fs >> tmp; // padding=5,5,5,5 
	startpos = tmp.find(L"=") + 1;
	tmp = tmp.substr(startpos, tmp.size() - startpos); // 5,5,5,5

													   // get up padding
	startpos = tmp.find(L",") + 1;
	font.toppadding = std::stoi(tmp.substr(0, startpos)) / (float)windowWidth;

	// get right padding
	tmp = tmp.substr(startpos, tmp.size() - startpos);
	startpos = tmp.find(L",") + 1;
	font.rightpadding = std::stoi(tmp.substr(0, startpos)) / (float)windowWidth;

	// get down padding
	tmp = tmp.substr(startpos, tmp.size() - startpos);
	startpos = tmp.find(L",") + 1;
	font.bottompadding = std::stoi(tmp.substr(0, startpos)) / (float)windowWidth;

	// get left padding
	tmp = tmp.substr(startpos, tmp.size() - startpos);
	font.leftpadding = std::stoi(tmp) / (float)windowWidth;

	fs >> tmp; // spacing=0,0

			   // get lineheight (how much to move down for each line), and normalize (between 0.0 and 1.0 based on size of font)
	fs >> tmp >> tmp; // common lineHeight=95
	startpos = tmp.find(L"=") + 1;
	font.lineHeight = (float)std::stoi(tmp.substr(startpos, tmp.size() - startpos)) / (float)windowHeight;

	// get base height (height of all characters), and normalize (between 0.0 and 1.0 based on size of font)
	fs >> tmp; // base=68
	startpos = tmp.find(L"=") + 1;
	font.baseHeight = (float)std::stoi(tmp.substr(startpos, tmp.size() - startpos)) / (float)windowHeight;

	// get texture width
	fs >> tmp; // scaleW=512
	startpos = tmp.find(L"=") + 1;
	font.textureWidth = std::stoi(tmp.substr(startpos, tmp.size() - startpos));

	// get texture height
	fs >> tmp; // scaleH=512
	startpos = tmp.find(L"=") + 1;
	font.textureHeight = std::stoi(tmp.substr(startpos, tmp.size() - startpos));

	// get pages, packed, page id
	fs >> tmp >> tmp; // pages=1 packed=0
	fs >> tmp >> tmp; // page id=0

					  // get texture filename
	std::wstring wtmp;
	fs >> wtmp; // file="Arial.png"
	startpos = wtmp.find(L"\"") + 1;
	font.fontImage = wtmp.substr(startpos, wtmp.size() - startpos - 1);

	// get number of characters
	fs >> tmp >> tmp; // chars count=97
	startpos = tmp.find(L"=") + 1;
	font.numCharacters = std::stoi(tmp.substr(startpos, tmp.size() - startpos));

	font.CharList = new FontChar[font.numCharacters];

	for (int c = 0; c < font.numCharacters; ++c)
	{
		// get unicode id
		fs >> tmp >> tmp; // char id=0
		startpos = tmp.find(L"=") + 1;
		font.CharList[c].id = std::stoi(tmp.substr(startpos, tmp.size() - startpos));

		// get x
		fs >> tmp; // x=392
		startpos = tmp.find(L"=") + 1;
		font.CharList[c].u = (float)std::stoi(tmp.substr(startpos, tmp.size() - startpos)) / (float)font.textureWidth;

		// get y
		fs >> tmp; // y=340
		startpos = tmp.find(L"=") + 1;
		font.CharList[c].v = (float)std::stoi(tmp.substr(startpos, tmp.size() - startpos)) / (float)font.textureHeight;

		// get width
		fs >> tmp; // width=47
		startpos = tmp.find(L"=") + 1;
		tmp = tmp.substr(startpos, tmp.size() - startpos);
		font.CharList[c].width = (float)std::stoi(tmp) / (float)windowWidth;
		font.CharList[c].twidth = (float)std::stoi(tmp) / (float)font.textureWidth;

		// get height
		fs >> tmp; // height=57
		startpos = tmp.find(L"=") + 1;
		tmp = tmp.substr(startpos, tmp.size() - startpos);
		font.CharList[c].height = (float)std::stoi(tmp) / (float)windowHeight;
		font.CharList[c].theight = (float)std::stoi(tmp) / (float)font.textureHeight;

		// get xoffset
		fs >> tmp; // xoffset=-6
		startpos = tmp.find(L"=") + 1;
		font.CharList[c].xoffset = (float)std::stoi(tmp.substr(startpos, tmp.size() - startpos)) / (float)windowWidth;

		// get yoffset
		fs >> tmp; // yoffset=16
		startpos = tmp.find(L"=") + 1;
		font.CharList[c].yoffset = (float)std::stoi(tmp.substr(startpos, tmp.size() - startpos)) / (float)windowHeight;

		// get xadvance
		fs >> tmp; // xadvance=65
		startpos = tmp.find(L"=") + 1;
		font.CharList[c].xadvance = (float)std::stoi(tmp.substr(startpos, tmp.size() - startpos)) / (float)windowWidth;

		// get page
		// get channel
		fs >> tmp >> tmp; // page=0    chnl=0

	}

	// get number of kernings
	fs >> tmp >> tmp; // kernings count=96
	startpos = tmp.find(L"=") + 1;
	font.numKernings = std::stoi(tmp.substr(startpos, tmp.size() - startpos));

	// initialize the kernings list
	font.KerningsList = new FontKerning[font.numKernings];

	for (int k = 0; k < font.numKernings; ++k)
	{
		// get first character
		fs >> tmp >> tmp; // kerning first=87
		startpos = tmp.find(L"=") + 1;
		font.KerningsList[k].firstid = std::stoi(tmp.substr(startpos, tmp.size() - startpos));

		// get second character
		fs >> tmp; // second=45
		startpos = tmp.find(L"=") + 1;
		font.KerningsList[k].secondid = std::stoi(tmp.substr(startpos, tmp.size() - startpos));

		// get amount
		fs >> tmp; // amount=-1
		startpos = tmp.find(L"=") + 1;
		int t = (float)std::stoi(tmp.substr(startpos, tmp.size() - startpos));
		font.KerningsList[k].amount = (float)t / (float)windowWidth;
	}

	fs.close();

	return font;
}

LRESULT CALLBACK WndProc(HWND hWnd,
	UINT msg,
	WPARAM wParam,
	LPARAM lParam)
{
	
	switch (msg)
	{

	case WM_KEYDOWN:
		if (wParam == VK_ESCAPE) {
			if (MessageBox(0, L"Are you sure you want to exit?",
				L"Really?", MB_YESNO | MB_ICONQUESTION) == IDYES)
				DestroyWindow(hWnd);
		}
		return 0;

	case WM_DESTROY:
		PostQuitMessage(0);
		return 0;
	}
	return DefWindowProc(hWnd, msg, wParam, lParam);
}

bool InitializeWindow(HINSTANCE hInstance,
	int showWindow,
	int width, int height,
	bool windowed)
{
	WNDCLASSEX wc;

	wc.cbSize = sizeof(WNDCLASSEX);
	wc.style = CS_HREDRAW | CS_VREDRAW;
	wc.lpfnWndProc = WndProc;
	wc.cbClsExtra = NULL;
	wc.cbWndExtra = NULL;
	wc.hInstance = hInstance;
	wc.hIcon = LoadIcon(NULL, IDI_APPLICATION);
	wc.hCursor = LoadCursor(NULL, IDC_ARROW);
	wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 2);
	wc.lpszMenuName = NULL;
	wc.lpszClassName = WndClassName;
	wc.hIconSm = LoadIcon(NULL, IDI_APPLICATION);
	
	if (!RegisterClassEx(&wc))
	{
		MessageBox(NULL, L"Error registering class",
			L"Error", MB_OK | MB_ICONERROR);
		return 1;
	}
	g_hWnd = CreateWindowEx(
		NULL,
		WndClassName,
		L"Window Title",
		WS_OVERLAPPEDWINDOW,
		CW_USEDEFAULT, CW_USEDEFAULT,
		width, height,
		NULL,
		NULL,
		hInstance,
		NULL
		);

	if (!g_hWnd)
	{
		MessageBox(NULL, L"Error creating window",
			L"Error", MB_OK | MB_ICONERROR);
			DWORD error = GetLastError();
		return 1;
	}

	ShowWindow(g_hWnd, showWindow);
	UpdateWindow(g_hWnd);
	return true;
}

bool InitD3D(HINSTANCE hInstance)
{
	HRESULT hr;
	DXGI_MODE_DESC bufferDesc;
	ZeroMemory(&bufferDesc, sizeof(DXGI_MODE_DESC));

	bufferDesc.Width = g_width;
	bufferDesc.Height =g_height;
	bufferDesc.RefreshRate.Numerator = 60;
	bufferDesc.RefreshRate.Denominator = 1;
	bufferDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
	bufferDesc.ScanlineOrdering = DXGI_MODE_SCANLINE_ORDER_UNSPECIFIED;
	bufferDesc.Scaling = DXGI_MODE_SCALING_UNSPECIFIED;

	DXGI_SWAP_CHAIN_DESC swapChainDesc;
	ZeroMemory(&swapChainDesc, sizeof(DXGI_SWAP_CHAIN_DESC));

	swapChainDesc.BufferDesc = bufferDesc;
	swapChainDesc.SampleDesc.Count = 1;
	swapChainDesc.SampleDesc.Quality = 0;
	swapChainDesc.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
	swapChainDesc.BufferCount = 1;
	swapChainDesc.OutputWindow = g_hWnd;
	swapChainDesc.Windowed = TRUE;
	swapChainDesc.SwapEffect = DXGI_SWAP_EFFECT_DISCARD;

	hr = D3D11CreateDeviceAndSwapChain(NULL, D3D_DRIVER_TYPE_HARDWARE, NULL, NULL, NULL, NULL,
		D3D11_SDK_VERSION, &swapChainDesc, &g_swapChain, &g_d3d11Device, NULL, &g_d3d11DevCon);
	if (FAILED(hr))
	{
		MessageBox(NULL, TEXT("Failed"),
			TEXT("D3D11CreateDeviceAndSwapChain"), MB_OK);
		return 0;
	}

	ID3D11Texture2D* backBuffer;
	hr = g_swapChain->GetBuffer(0, __uuidof(ID3D11Texture2D), (void**)&backBuffer);
	if (FAILED(hr))
	{
		MessageBox(NULL, TEXT("Failed"),
			TEXT("SwapChain->GetBuffer"), MB_OK);
		return 0;
	}

	hr = g_d3d11Device->CreateRenderTargetView(backBuffer, NULL, &g_renderTargetView);
	backBuffer->Release();
	if (FAILED(hr))
	{
		MessageBox(NULL, TEXT("Failed"),
			TEXT("d3d11Device->CreateRenderTargetView"), MB_OK);
		return 0;
	}

	D3D11_TEXTURE2D_DESC depthStencilDesc;
	depthStencilDesc.Width = g_width;
	depthStencilDesc.Height = g_height;
	depthStencilDesc.MipLevels = 1;
	depthStencilDesc.ArraySize = 1;
	depthStencilDesc.Format = DXGI_FORMAT_D24_UNORM_S8_UINT;
	depthStencilDesc.SampleDesc.Count = 1;
	depthStencilDesc.SampleDesc.Quality = 0;
	depthStencilDesc.Usage = D3D11_USAGE_DEFAULT;
	depthStencilDesc.BindFlags = D3D11_BIND_DEPTH_STENCIL;
	depthStencilDesc.CPUAccessFlags = 0;
	depthStencilDesc.MiscFlags = 0;

	g_d3d11Device->CreateTexture2D(&depthStencilDesc, NULL, &g_depthStencilBuffer);
	g_d3d11Device->CreateDepthStencilView(g_depthStencilBuffer, NULL, &g_depthStencilView);
	
	g_d3d11DevCon->OMSetRenderTargets(1, &g_renderTargetView, g_depthStencilView);
	
	D3D11_RASTERIZER_DESC rastDesc;
	ZeroMemory(&rastDesc, sizeof(D3D11_RASTERIZER_DESC));
	rastDesc.FillMode = D3D11_FILL_WIREFRAME;
	rastDesc.CullMode = D3D11_CULL_NONE;
	hr = g_d3d11Device->CreateRasterizerState(&rastDesc, &g_wireFrame);

	ZeroMemory(&rastDesc, sizeof(D3D11_RASTERIZER_DESC));
	rastDesc.FillMode = D3D11_FILL_SOLID;
	rastDesc.CullMode = D3D11_CULL_NONE;
	hr = g_d3d11Device->CreateRasterizerState(&rastDesc, &g_solid);

	ZeroMemory(&rastDesc, sizeof(D3D11_RASTERIZER_DESC));
	rastDesc.FillMode = D3D11_FILL_SOLID;
	rastDesc.CullMode = D3D11_CULL_NONE;

	g_d3d11Device->CreateRasterizerState(&rastDesc, &g_noCull);

	return 1;
}

void ReleaseD3D()
{
	if (g_swapChain != NULL) g_swapChain->Release();
	if (g_d3d11Device != NULL) g_d3d11Device->Release();
	if (g_d3d11DevCon != NULL) g_d3d11DevCon->Release();
	if (g_squareIndexBuffer != NULL) g_squareIndexBuffer->Release();
	if (g_squareVertBuffer != NULL) g_squareVertBuffer->Release();
	if (g_depthStencilView != NULL) g_depthStencilView->Release();
	if (g_depthStencilBuffer != NULL) g_depthStencilBuffer->Release();
	if (g_VS != NULL) g_VS->Release();
	if (g_PS != NULL) g_PS->Release();
	if (g_VS_Buffer != NULL) g_VS_Buffer->Release();
	if (g_PS_Buffer != NULL) g_PS_Buffer->Release();
	if (g_vertLayout != NULL) g_vertLayout->Release();
	if (g_vertLayout != NULL) g_cbPerObjectBuffer->Release();
	if (g_wireFrame != NULL) g_wireFrame->Release();
	if (g_solid != NULL) g_solid->Release();
	if (g_cubesTexture != NULL) g_cubesTexture->Release();
	if (g_cubesTexSamplerState != NULL) g_cubesTexSamplerState->Release();
	if (g_transparency != NULL) g_transparency->Release();
	if (g_CCWcullMode != NULL) g_CCWcullMode->Release();
	if (g_CWcullMode != NULL) g_CWcullMode->Release();
	if (g_noCull != NULL) g_noCull->Release();

	if (g_pMesh != NULL) g_pMesh->Destroy();
	g_Material.Destroy();
	//g_pVertexShader->Release();
//	g_pPixelShader->Release();
}

bool InitScene()
{
	g_pOctree = new OctreeNode(NULL, Vector3(0.0, 0.0, 0.0), 1024, 4);
	g_pCamera = new Camera();
	Vector3 v1(0.0, 1.0, 1.0);
	double length = v1.Length();

	HRESULT hr;
	g_pMesh = Mesh::Cube();
	g_pTerrain = Mesh::Terrain();
	g_pTexture = new Texture2D();
	g_pShader = new Shader();

	g_pTexture->Create(g_d3d11Device, L"fieldstone.jpg");
	g_pShader->Create(g_d3d11Device, L"VertexShader.hlsl", L"PixelShader.hlsl");
	g_pMesh->Create(g_d3d11Device);
	g_pTerrain->Create(g_d3d11Device);
	g_Material.Create(g_d3d11Device, g_pShader, g_pTexture);

	D3D11_VIEWPORT viewport;
	ZeroMemory(&viewport, sizeof(D3D11_VIEWPORT));

	viewport.TopLeftX = 0;
	viewport.TopLeftY = 0;
	viewport.Width = g_width;
	viewport.Height = g_height;
	viewport.MinDepth = 0.0f;
	viewport.MaxDepth = 1.0f;

	g_d3d11DevCon->RSSetViewports(1, &viewport);
	
	D3D11_BUFFER_DESC cbbd;   
	ZeroMemory(&cbbd, sizeof(D3D11_BUFFER_DESC));
	
	cbbd.Usage = D3D11_USAGE_DEFAULT;
	cbbd.ByteWidth = sizeof(cbPerObject);
	cbbd.BindFlags = D3D11_BIND_CONSTANT_BUFFER;
	cbbd.CPUAccessFlags = 0;
	cbbd.MiscFlags = 0;
	
	hr = g_d3d11Device->CreateBuffer(&cbbd, NULL, &g_cbPerObjectBuffer);

	g_camPosition = XMVectorSet(0.0f, 4.0f, -5.0f, 0.0f);
	g_camTarget = XMVectorSet(0.0f, 0.0f, 0.0f, 0.0f);
	g_camUp = XMVectorSet(0.0f, 1.0f, 0.0f, 0.0f);

	Matrix4 wm = g_pCamera->GetWorldMatrix();
//	g_camView = XMMatrixLookAtLH(g_camPosition, g_camTarget, g_camUp);
//	g_camView = XMMatrix(wm)
	g_camProjection = XMMatrixPerspectiveFovLH(0.4f*3.14f, (float)g_width / g_height, 1.0f, 1000.0f);

//	hr = CreateWICTextureFromFile(g_d3d11Device, L"clover.dds", NULL, &g_cubesTexture, NULL);
	hr = CreateWICTextureFromFile(g_d3d11Device, L"blah.png", NULL, &g_cubesTexture, NULL);

	D3D11_SAMPLER_DESC sampDesc;
	ZeroMemory(&sampDesc, sizeof(sampDesc));
	sampDesc.Filter = D3D11_FILTER_MIN_MAG_MIP_LINEAR;
	sampDesc.AddressU = D3D11_TEXTURE_ADDRESS_WRAP;
	sampDesc.AddressV = D3D11_TEXTURE_ADDRESS_WRAP;
	sampDesc.AddressW = D3D11_TEXTURE_ADDRESS_WRAP;
	sampDesc.ComparisonFunc = D3D11_COMPARISON_NEVER;
	sampDesc.MinLOD = 0;
	sampDesc.MaxLOD = D3D11_FLOAT32_MAX;

	hr = g_d3d11Device->CreateSamplerState(&sampDesc, &g_cubesTexSamplerState);

	D3D11_BLEND_DESC blendDesc;
	ZeroMemory(&blendDesc, sizeof(blendDesc));

	D3D11_RENDER_TARGET_BLEND_DESC rtbd;
	ZeroMemory(&rtbd, sizeof(rtbd));

	rtbd.BlendEnable = true;
	rtbd.SrcBlend = D3D11_BLEND_SRC_COLOR;
	rtbd.DestBlend = D3D11_BLEND_BLEND_FACTOR;
	rtbd.BlendOp = D3D11_BLEND_OP_ADD;
	rtbd.SrcBlendAlpha = D3D11_BLEND_ONE;
	rtbd.DestBlendAlpha = D3D11_BLEND_ZERO;
	rtbd.BlendOpAlpha = D3D11_BLEND_OP_ADD;
	rtbd.RenderTargetWriteMask = D3D10_COLOR_WRITE_ENABLE_ALL;

	blendDesc.AlphaToCoverageEnable = false;
	blendDesc.RenderTarget[0] = rtbd;

	g_d3d11Device->CreateBlendState(&blendDesc, &g_transparency);


	D3D11_RASTERIZER_DESC cmdesc;
	ZeroMemory(&cmdesc, sizeof(D3D11_RASTERIZER_DESC));

	cmdesc.FillMode = D3D11_FILL_SOLID;
	cmdesc.CullMode = D3D11_CULL_BACK;

	cmdesc.FrontCounterClockwise = true;
	hr = g_d3d11Device->CreateRasterizerState(&cmdesc, &g_CCWcullMode);

	cmdesc.FrontCounterClockwise = false;
	hr = g_d3d11Device->CreateRasterizerState(&cmdesc, &g_CWcullMode);

	return true;
}

void UpdateScene(float delta)
{
	//rot += .00005f;
	if (rot > 6.26f)
		rot = 0.0f;

	g_cube1World = XMMatrixIdentity();
	XMVECTOR rotaxis = XMVectorSet(0.0f, 1.0f, 0.0f, 0.0f);
	g_rotation = XMMatrixRotationAxis(rotaxis, rot);
	g_translation = XMMatrixTranslation(0.0f, 0.0f, 4.0f);
	g_cube1World = g_translation * g_rotation;

	g_cube2World = XMMatrixIdentity();
	g_rotation = XMMatrixRotationAxis(rotaxis, -rot);
	g_scale = XMMatrixScaling(1.3f, 1.3f, 1.3f);
	g_cube2World = g_rotation * g_scale;

}

void RenderText(Font font, std::wstring text, XMFLOAT2 pos, XMFLOAT2 scale, XMFLOAT2 padding, XMFLOAT4 color)
{
	int numCharacters = 0;

	float topLeftScreenX = (pos.x * 2.0f) - 1.0f;
	float topLeftScreenY = ((1.0f - pos.y) * 2.0f) - 1.0f;

	float x = topLeftScreenX;
	float y = topLeftScreenY;

	float horrizontalPadding = (font.leftpadding + font.rightpadding) * padding.x;
	float verticalPadding = (font.toppadding + font.bottompadding) * padding.y;

	wchar_t lastChar = -1;


	D3D11_MAPPED_SUBRESOURCE mappedResource;
	ZeroMemory(&mappedResource, sizeof(D3D11_MAPPED_SUBRESOURCE));
	g_d3d11DevCon->Map(g_textVertexBuffer, 0, D3D11_MAP_WRITE_DISCARD, 0, &mappedResource);

	TextVertex* vert = (TextVertex*)mappedResource.pData;

	for (int i = 0; i < text.size(); ++i)
	{
		wchar_t c = text[i];

		FontChar* fc = font.GetChar(c);

		// character not in font char set
		if (fc == nullptr)
			continue;

		// end of string
		if (c == L'\0')
			break;

		// new line
		if (c == L'\n')
		{
			x = topLeftScreenX;
			y -= (font.lineHeight + verticalPadding) * scale.y;
			continue;
		}
		// don't overflow the buffer. In your app if this is true, you can implement a resize of your text vertex buffer
		if (numCharacters >= g_maxNumTextCharacters)
			break;

		float kerning = 0.0f;
		if (i > 0)
			kerning = font.GetKerning(lastChar, c);

		vert[numCharacters] = TextVertex(color.x,
			color.y,
			color.z,
			color.w,
			fc->u,
			fc->v,
			fc->twidth,
			fc->theight,
			x + ((fc->xoffset + kerning) * scale.x),
			y - (fc->yoffset * scale.y),
			fc->width * scale.x,
			fc->height * scale.y);

		numCharacters++;

		// remove horrizontal padding and advance to next char position
		x += (fc->xadvance - horrizontalPadding) * scale.x;

		lastChar = c;

	}
	g_d3d11DevCon->Unmap(g_textVertexBuffer, 0);

	g_d3d11DevCon->DrawInstanced(4, numCharacters, 0, 0);
}
void RenderScene()
{
	float bgColor[] = { 0.0f, 0.0f, 0.5f, 1.0f };

	g_d3d11DevCon->ClearDepthStencilView(g_depthStencilView, D3D11_CLEAR_DEPTH | D3D11_CLEAR_STENCIL, 1.0f, 0);
	g_d3d11DevCon->ClearRenderTargetView(g_renderTargetView, bgColor);

	//float blendFactor[] = { 0.75f, 0.75f, 0.75f, 1.0f };
	//g_d3d11DevCon->OMSetBlendState(0, 0, 0xffffffff);
	//g_d3d11DevCon->OMSetBlendState(g_transparency, blendFactor, 0xffffffff);

	XMVECTOR cubePos = XMVectorZero();
	cubePos = XMVector3TransformCoord(cubePos, g_cube1World);
	float distX = XMVectorGetX(cubePos) - XMVectorGetX(g_camPosition);
	float distY = XMVectorGetY(cubePos) - XMVectorGetY(g_camPosition);
	float distZ = XMVectorGetZ(cubePos) - XMVectorGetZ(g_camPosition);

	float cube1Dist = distX*distX + distY*distY + distZ*distZ;

	cubePos = XMVectorZero();

	cubePos = XMVector3TransformCoord(cubePos, g_cube2World);

	distX = XMVectorGetX(cubePos) - XMVectorGetX(g_camPosition);
	distY = XMVectorGetY(cubePos) - XMVectorGetY(g_camPosition);
	distZ = XMVectorGetZ(cubePos) - XMVectorGetZ(g_camPosition);

	float cube2Dist = distX*distX + distY*distY + distZ*distZ;
	/**
	if (cube1Dist < cube2Dist)
	{
		//Switch the order in which the cubes are drawn
		XMMATRIX tempMatrix = g_cube1World;
		g_cube1World = g_cube2World;
		g_cube2World = tempMatrix;
	}**/

	//g_WVP = g_cube2World * g_camView * g_camProjection;
	//cbPerObj.WVP = XMMatrixTranspose(g_WVP);

	g_pCamera->SetPosition(Vector3(3, 3, 0));
	Matrix4 vm = g_pCamera->GetWorldMatrix();
	g_camView = XMMATRIX(
		vm(0, 0), vm(0, 1), vm(0, 2), vm(0, 3),
		vm(1, 0), vm(1, 1), vm(1, 2), vm(1, 3),
		vm(2, 0), vm(2, 1), vm(2, 2), vm(2, 3),
		vm(3, 0), vm(3, 1), vm(3, 2), vm(3, 3)
	);

	g_Material.Render(g_d3d11DevCon, g_cube2World, g_camView, g_camProjection);
//	g_pShader->Render(g_d3d11DevCon);
//	g_d3d11DevCon->UpdateSubresource(g_cbPerObjectBuffer, 0, NULL, &cbPerObj, 0, 0);
//	g_d3d11DevCon->VSSetConstantBuffers(0, 1, &g_cbPerObjectBuffer);
//	g_d3d11DevCon->PSSetShaderResources(0, 1, g_pTexture->GetTexture());
	g_pTerrain->Render(g_d3d11DevCon);
//	g_pMesh->Render(g_d3d11DevCon);

	g_d3d11DevCon->RSSetState(g_CWcullMode);
	g_d3d11DevCon->DrawIndexed(g_pTerrain->GetIndexCount(), 0, 0);

	g_d3d11DevCon->RSSetState(g_CCWcullMode);
//	g_d3d11DevCon->DrawIndexed(36, 0, 0);

//	g_Material.Render(g_d3d11DevCon, g_cube1World, g_camView, g_camProjection);
	g_d3d11DevCon->DrawIndexed(g_pTerrain->GetIndexCount(), 0, 0);

	g_swapChain->Present(0, 0);
}

int MessageLoop()
{
	MSG msg;
	ZeroMemory(&msg, sizeof(MSG));

	while (true)
	{
		if (PeekMessage(&msg, NULL, 0, 0, PM_REMOVE))
		{
			if (msg.message == WM_QUIT)
				break;

			TranslateMessage(&msg);
			DispatchMessage(&msg);
		}
		else
		{
			double delta = g_timer.GetFrameDelta();
			UpdateScene(delta);
			RenderScene();
		}
	}
	return msg.wParam;
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nShowCmd)
{
	if (!InitializeWindow(hInstance, nShowCmd, g_width, g_height, true))
	{
		MessageBox(0, L"Window Init - Failed", L"Error", MB_OK);
		return 0;
	}

	if (!InitD3D(hInstance))
	{

	}
	Font font = LoadFont(L"font.fnt");

	InitScene();

	MessageLoop();
	
	ReleaseD3D();
	
	return 0;
}