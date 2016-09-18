cbuffer cbPerObject
{
	float4x4 WVP;
	float4x4 W;
	float4x4 V;
	float4x4 P;
};

Texture2D ObjTexture;
SamplerState ObjSamplerState;

struct VS_OUTPUT
{
	float4 Pos : SV_POSITION;
	float3 Normal : NORMAL;
	float2 TexCoord : TEXCOORD;
};

VS_OUTPUT main(float4 inPos : POSITION, float3 inNormal : NORMAL, float2 inTexCoord : TEXCOORD)
{
	VS_OUTPUT output;

	output.Pos = mul(inPos, WVP);
	output.TexCoord = inTexCoord;

	return output;
}