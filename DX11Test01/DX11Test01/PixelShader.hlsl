Texture2D ObjTexture;
SamplerState ObjSamplerState;

struct VS_OUTPUT
{
	float4 Pos : SV_POSITION;
	float3 Normal : NORMAL;
	float2 TexCoord : TEXCOORD;
};

float4 main(VS_OUTPUT input) : SV_TARGET
{
	float4 diffuse = ObjTexture.Sample(ObjSamplerState, input.TexCoord);

	clip(diffuse.a - .25);

	return diffuse;
}