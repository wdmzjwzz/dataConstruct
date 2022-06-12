
// import * as typedArrays from './typedarrays.js';
// import * as m4 from './m4.js';
// import * as v3 from './v3.js';

// /**
//  * @typedef {(Int8Array|Uint8Array|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array)} TypedArray
//  */

// /**
//  * Add `push` to a typed array. It just keeps a 'cursor'
//  * and allows use to `push` values into the array so we
//  * don't have to manually compute offsets
//  * @param {TypedArray} typedArray TypedArray to augment
//  * @param {number} numComponents number of components.
//  * @private
//  */
// function augmentTypedArray(typedArray: any[], numComponents: any) {
//   let cursor = 0;
//   typedArray.push = function () {
//     for (let ii = 0; ii < arguments.length; ++ii) {
//       const value = arguments[ii];
//       if (value instanceof Array || typedArrays.isArrayBuffer(value)) {
//         for (let jj = 0; jj < value.length; ++jj) {
//           typedArray[cursor++] = value[jj];
//         }
//       } else {
//         typedArray[cursor++] = value;
//       }
//     }
//   };
//   typedArray.reset = function (opt_index: number) {
//     cursor = opt_index || 0;
//   };
//   typedArray.numComponents = numComponents;
//   Object.defineProperty(typedArray, 'numElements', {
//     get: function () {
//       return this.length / this.numComponents | 0;
//     },
//   });
//   return typedArray;
// }

// function createAugmentedTypedArray(numComponents: number, numElements: number, opt_type: Float32ArrayConstructor | Uint16ArrayConstructor) {
//   const Type = opt_type || Float32Array;
//   return augmentTypedArray(new Type(numComponents * numElements), numComponents);
// }



// function applyFuncToV3Array(array: string | any[], matrix: any, fn: { (mi: any, v: any, dst: any): any; (arg0: any, arg1: any[], arg2: Float32Array): void; }) {
//   const len = array.length;
//   const tmp = new Float32Array(3);
//   for (let ii = 0; ii < len; ii += 3) {
//     fn(matrix, [array[ii], array[ii + 1], array[ii + 2]], tmp);
//     array[ii] = tmp[0];
//     array[ii + 1] = tmp[1];
//     array[ii + 2] = tmp[2];
//   }
// }

// function transformNormal(mi: number[], v: any[], dst: number[]) {
//   dst = dst || v3.create();
//   const v0 = v[0];
//   const v1 = v[1];
//   const v2 = v[2];

//   dst[0] = v0 * mi[0 * 4 + 0] + v1 * mi[0 * 4 + 1] + v2 * mi[0 * 4 + 2];
//   dst[1] = v0 * mi[1 * 4 + 0] + v1 * mi[1 * 4 + 1] + v2 * mi[1 * 4 + 2];
//   dst[2] = v0 * mi[2 * 4 + 0] + v1 * mi[2 * 4 + 1] + v2 * mi[2 * 4 + 2];

//   return dst;
// }

// /**
//  * Reorients directions by the given matrix..
//  * @param {(number[]|TypedArray)} array The array. Assumes value floats per element.
//  * @param {module:twgl/m4.Mat4} matrix A matrix to multiply by.
//  * @return {(number[]|TypedArray)} the same array that was passed in
//  * @memberOf module:twgl/primitives
//  */
// function reorientDirections(array: any, matrix: any) {
//   applyFuncToV3Array(array, matrix, m4.transformDirection);
//   return array;
// }

// /**
//  * Reorients normals by the inverse-transpose of the given
//  * matrix..
//  * @param {(number[]|TypedArray)} array The array. Assumes value floats per element.
//  * @param {module:twgl/m4.Mat4} matrix A matrix to multiply by.
//  * @return {(number[]|TypedArray)} the same array that was passed in
//  * @memberOf module:twgl/primitives
//  */
// function reorientNormals(array: any, matrix: any) {
//   applyFuncToV3Array(array, m4.inverse(matrix), transformNormal);
//   return array;
// }

// /**
//  * Reorients positions by the given matrix. In other words, it
//  * multiplies each vertex by the given matrix.
//  * @param {(number[]|TypedArray)} array The array. Assumes value floats per element.
//  * @param {module:twgl/m4.Mat4} matrix A matrix to multiply by.
//  * @return {(number[]|TypedArray)} the same array that was passed in
//  * @memberOf module:twgl/primitives
//  */
// function reorientPositions(array: any, matrix: any) {
//   applyFuncToV3Array(array, matrix, m4.transformPoint);
//   return array;
// }


// function reorientVertices(arrays: { [x: string]: any; position?: any; normal?: any; texcoord?: any; indices?: any; }, matrix: any) {
//   Object.keys(arrays).forEach(function (name) {
//     const array = arrays[name];
//     if (name.indexOf("pos") >= 0) {
//       reorientPositions(array, matrix);
//     } else if (name.indexOf("tan") >= 0 || name.indexOf("binorm") >= 0) {
//       reorientDirections(array, matrix);
//     } else if (name.indexOf("norm") >= 0) {
//       reorientNormals(array, matrix);
//     }
//   });
//   return arrays;
// }


// function createPlaneVertices(width: number = 1, depth: number = 1, subdivisionsWidth: number = 1, subdivisionsDepth: number = 1, matrix: any) {

//   matrix = matrix || m4.identity();

//   const numVertices = (subdivisionsWidth + 1) * (subdivisionsDepth + 1);
//   const positions = createAugmentedTypedArray(3, numVertices);
//   const normals = createAugmentedTypedArray(3, numVertices);
//   const texcoords = createAugmentedTypedArray(2, numVertices);

//   for (let z = 0; z <= subdivisionsDepth; z++) {
//     for (let x = 0; x <= subdivisionsWidth; x++) {
//       const u = x / subdivisionsWidth;
//       const v = z / subdivisionsDepth;
//       positions.push(
//         width * u - width * 0.5,
//         0,
//         depth * v - depth * 0.5);
//       normals.push(0, 1, 0);
//       texcoords.push(u, v);
//     }
//   }

//   const numVertsAcross = subdivisionsWidth + 1;
//   const indices = createAugmentedTypedArray(
//     3, subdivisionsWidth * subdivisionsDepth * 2, Uint16Array);

//   for (let z = 0; z < subdivisionsDepth; z++) {  // eslint-disable-line
//     for (let x = 0; x < subdivisionsWidth; x++) {  // eslint-disable-line
//       // Make triangle 1 of quad.
//       indices.push(
//         (z + 0) * numVertsAcross + x,
//         (z + 1) * numVertsAcross + x,
//         (z + 0) * numVertsAcross + x + 1);

//       // Make triangle 2 of quad.
//       indices.push(
//         (z + 1) * numVertsAcross + x,
//         (z + 1) * numVertsAcross + x + 1,
//         (z + 0) * numVertsAcross + x + 1);
//     }
//   }

//   const arrays = reorientVertices({
//     position: positions,
//     normal: normals,
//     texcoord: texcoords,
//     indices: indices,
//   }, matrix);
//   return arrays;
// }


// function createSphereVertices(
//   radius: number,
//   subdivisionsAxis: number,
//   subdivisionsHeight: number,
//   opt_startLatitudeInRadians: number,
//   opt_endLatitudeInRadians: number,
//   opt_startLongitudeInRadians: number,
//   opt_endLongitudeInRadians: number) {
//   if (subdivisionsAxis <= 0 || subdivisionsHeight <= 0) {
//     throw new Error('subdivisionAxis and subdivisionHeight must be > 0');
//   }

//   opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
//   opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
//   opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
//   opt_endLongitudeInRadians = opt_endLongitudeInRadians || (Math.PI * 2);

//   const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
//   const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

//   // We are going to generate our sphere by iterating through its
//   // spherical coordinates and generating 2 triangles for each quad on a
//   // ring of the sphere.
//   const numVertices = (subdivisionsAxis + 1) * (subdivisionsHeight + 1);
//   const positions = createAugmentedTypedArray(3, numVertices);
//   const normals = createAugmentedTypedArray(3, numVertices);
//   const texcoords = createAugmentedTypedArray(2, numVertices);

//   // Generate the individual vertices in our vertex buffer.
//   for (let y = 0; y <= subdivisionsHeight; y++) {
//     for (let x = 0; x <= subdivisionsAxis; x++) {
//       // Generate a vertex based on its spherical coordinates
//       const u = x / subdivisionsAxis;
//       const v = y / subdivisionsHeight;
//       const theta = longRange * u + opt_startLongitudeInRadians;
//       const phi = latRange * v + opt_startLatitudeInRadians;
//       const sinTheta = Math.sin(theta);
//       const cosTheta = Math.cos(theta);
//       const sinPhi = Math.sin(phi);
//       const cosPhi = Math.cos(phi);
//       const ux = cosTheta * sinPhi;
//       const uy = cosPhi;
//       const uz = sinTheta * sinPhi;
//       positions.push(radius * ux, radius * uy, radius * uz);
//       normals.push(ux, uy, uz);
//       texcoords.push(1 - u, v);
//     }
//   }

//   const numVertsAround = subdivisionsAxis + 1;
//   const indices = createAugmentedTypedArray(3, subdivisionsAxis * subdivisionsHeight * 2, Uint16Array);
//   for (let x = 0; x < subdivisionsAxis; x++) {  // eslint-disable-line
//     for (let y = 0; y < subdivisionsHeight; y++) {  // eslint-disable-line
//       // Make triangle 1 of quad.
//       indices.push(
//         (y + 0) * numVertsAround + x,
//         (y + 0) * numVertsAround + x + 1,
//         (y + 1) * numVertsAround + x);

//       // Make triangle 2 of quad.
//       indices.push(
//         (y + 1) * numVertsAround + x,
//         (y + 0) * numVertsAround + x + 1,
//         (y + 1) * numVertsAround + x + 1);
//     }
//   }

//   return {
//     position: positions,
//     normal: normals,
//     texcoord: texcoords,
//     indices: indices,
//   };
// }

// /**
//  * Array of the indices of corners of each face of a cube.
//  * @type {Array.<number[]>}
//  * @private
//  */
// const CUBE_FACE_INDICES = [
//   [3, 7, 5, 1],  // right
//   [6, 2, 0, 4],  // left
//   [6, 7, 3, 2],  // ??
//   [0, 1, 5, 4],  // ??
//   [7, 6, 4, 5],  // front
//   [2, 3, 1, 0],  // back
// ];

// function createCubeVertices(size: number) {
//   size = size || 1;
//   const k = size / 2;

//   const cornerVertices = [
//     [-k, -k, -k],
//     [+k, -k, -k],
//     [-k, +k, -k],
//     [+k, +k, -k],
//     [-k, -k, +k],
//     [+k, -k, +k],
//     [-k, +k, +k],
//     [+k, +k, +k],
//   ];

//   const faceNormals = [
//     [+1, +0, +0],
//     [-1, +0, +0],
//     [+0, +1, +0],
//     [+0, -1, +0],
//     [+0, +0, +1],
//     [+0, +0, -1],
//   ];

//   const uvCoords = [
//     [1, 0],
//     [0, 0],
//     [0, 1],
//     [1, 1],
//   ];

//   const numVertices = 6 * 4;
//   const positions = createAugmentedTypedArray(3, numVertices);
//   const normals = createAugmentedTypedArray(3, numVertices);
//   const texcoords = createAugmentedTypedArray(2, numVertices);
//   const indices = createAugmentedTypedArray(3, 6 * 2, Uint16Array);

//   for (let f = 0; f < 6; ++f) {
//     const faceIndices = CUBE_FACE_INDICES[f];
//     for (let v = 0; v < 4; ++v) {
//       const position = cornerVertices[faceIndices[v]];
//       const normal = faceNormals[f];
//       const uv = uvCoords[v];

//       // Each face needs all four vertices because the normals and texture
//       // coordinates are not all the same.
//       positions.push(position);
//       normals.push(normal);
//       texcoords.push(uv);

//     }
//     // Two triangles make a square face.
//     const offset = 4 * f;
//     indices.push(offset + 0, offset + 1, offset + 2);
//     indices.push(offset + 0, offset + 2, offset + 3);
//   }

//   return {
//     position: positions,
//     normal: normals,
//     texcoord: texcoords,
//     indices: indices,
//   };
// }


// export {
//   createCubeVertices,
//   createPlaneVertices,
//   createSphereVertices,

// };

