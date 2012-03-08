function Matrix4(){
    this.m11 = this.m22 = this.m33 = this.m44 = 1.0;

    this.m12 = this.m13 = this.m14 = 
    this.m21 = this.m23 = this.m24 = 
    this.m31 = this.m32 = this.m34 =
    this.m41 = this.m42 = this.m43 = 0.0;
}
Matrix4.prototype.setTranslation = function(v){
    this.m41 = v.x;
    this.m42 = v.y;
    this.m43 = v.z;
};
Matrix4.prototype.right = function(a) {
    var r = a || new Vector3();
    r.x = this.m11;
    r.y = this.m21;
    r.z = this.m31;
    return r;
};
Matrix4.prototype.up = function(a) {
    var r = a || new Vector3();
    r.x = this.m12;
    r.y = this.m22;
    r.z = this.m32;
    return r;
};
Matrix4.prototype.forward = function(a) {
    var r = a || new Vector3();
    r.x = this.m13;
    r.y = this.m23;
    r.z = this.m33;
    return r;
};
Matrix4.prototype.multiply = function(a,b) {
    var 
    a11 = a.m11, a12 = a.m12, a13 = a.m13, a14 = a.m14,
    a21 = a.m21, a22 = a.m22, a23 = a.m23, a24 = a.m24,
	a31 = a.m31, a32 = a.m32, a33 = a.m33, a34 = a.m34,
	a41 = a.m41, a42 = a.m42, a43 = a.m43, a44 = a.m44,

	b11 = b.m11, b12 = b.m12, b13 = b.m13, b14 = b.n14,
	b21 = b.m21, b22 = b.m22, b23 = b.m23, b24 = b.m24,
	b31 = b.m31, b32 = b.m32, b33 = b.m33, b34 = b.m34,
	b41 = b.m41, b42 = b.m42, b43 = b.m43, b44 = b.m44;    

    this.m11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
	this.m12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
	this.m13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
	this.m14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

	this.m21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
	this.m22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
	this.m23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
	this.m24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

	this.m31 = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
	this.m32 = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
	this.m33 = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
	this.m34 = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

	this.m41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
	this.m42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
	this.m43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
	this.m44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return this;
};

Matrix4.prototype.toArray = function(a) {
	a[0]  = this.m11; a[1]  = this.m12; a[2]  = this.m13; a[3]  = this.m14;
	a[4]  = this.m21; a[5]  = this.m22; a[6]  = this.m23; a[7]  = this.m24;
	a[8]  = this.m31; a[9]  = this.m32; a[10] = this.m33; a[11] = this.m34;
	a[12] = this.m41; a[13] = this.m42; a[14] = this.m43; a[15] = this.m44;

	return a;
};
Matrix4.prototype.fromQuaternion = function(q) {
    var xx      = q.x * q.x;
    var xy      = q.x * q.y;
    var xz      = q.x * q.z;
    var xw      = q.x * q.w;
    
    var yy      = q.y * q.y;
    var yz      = q.y * q.z;
    var yw      = q.y * q.w;
    
    var zz      = q.z * q.z;
    var zw      = q.z * q.w;    

    this.m00  = 1 - 2 * ( yy + zz );
    this.m01  =     2 * ( xy - zw );
    this.m02 =     2 * ( xz + yw );
    
    this.m10  =     2 * ( xy + zw );
    this.m11  = 1 - 2 * ( xx + zz );
    this.m12  =     2 * ( yz - xw );
    
    this.m20  =     2 * ( xz - yw );
    this.m21  =     2 * ( yz + xw );
    this.m22  = 1 - 2 * ( xx + yy );
    
    this.m03  = this.m13 = this.m23 = this.m30 = this.m31 = this.m32 = 0;
    this.m33 = 1;
};
