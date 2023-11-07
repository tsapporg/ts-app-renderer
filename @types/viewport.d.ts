import { RendererConfig } from './a.renderer';
export declare const fitCanvasToContainer: (canvas: HTMLCanvasElement) => void;
export declare const getDimensions: (config: RendererConfig) => Dimensions;
export declare const getElementDimensions: (element: ViewportElementType) => Dimensions;
type ViewportElementType = HTMLVideoElement | HTMLCanvasElement | HTMLElement;
export interface Dimensions {
    width: number;
    height: number;
}
export declare const getPixels: (webGLRenderingContext: WebGLRenderingContext | WebGL2RenderingContext, activeViewportDimensions?: Dimensions) => Uint8Array;
export declare const defaultViewportDimensions: {
    width: number;
    height: number;
};
export {};
//# sourceMappingURL=viewport.d.ts.map