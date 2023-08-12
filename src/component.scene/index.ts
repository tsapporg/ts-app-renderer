// This file is responsible for providing a web component for Babylon/Three scenes.
import * as core from 'ts-app-core';
core.logger.debug('scene component loaded');

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import * as renderer from 'ts-app-renderer';
import ExampleScene from './scene';
import ExampleStaticLevel from './level.static';
import ExampleOrbitingLevel from './level.orbiting';
import * as constants from '../constants';

@core.classLogger.LogClass()
@customElement('scene-component')
export class SceneComponent extends LitElement {
  @property({ type: String })
  rendererLibrary: renderer.RendererLibrary = 'babylon';
  @property({ type: String })
  levelName: ExampleLevelName = 'static';
  @property({ type: Boolean })
  debug: boolean = false;

  // See: https://stackoverflow.com/questions/60678891/how-can-i-change-a-boolean-property-in-lit-element-to-hide-content-on-my-compone
  @property({ type: String, reflect: true, attribute: false })
  hide: string = 'hide';
  @property({ type: Boolean, reflect: true, attribute: false })
  loading: boolean = false;
  
  @state()
  protected sceneId: string = Date.now().toString();
  @state()
  protected renderer?: renderer.IRenderer; // TODO allow passing in of renderer if already exists.
  @state()
  protected scene?: ExampleScene; // TODO allow passing in of scene if already exists. TODO scene impl
  @state()
  protected level?: renderer.ILevel; // TODO allow passing in of scene if already exists. TODO scene impl
  @state()
  protected rendererState: renderer.RendererState = new renderer.RendererState();

  constructor() {
    super();
  }

  static override styles = css`
    .scene {
 
    }
    .scene-canvas {
      height: 100%;
    }
    .save-button {
      display: inline;
    }
    .hide {
      display: none;
    }
  `;

  @core.classLogger.Log()
  protected override render() {
    return html`
      <link rel='stylesheet' href='../deps.css' />
      <!-- 
        TODO better way to make vanilla .js files available?
        See make -f makefile.develop build/website/public for where this is made available. 
      -->
      ${this.loadScript('gif.js')}
      ${this.loadScript('gif.worker.js')}
      <!--<div class="${this.loading ? this.hide : ''}">-->
        ${this.levelName === 'static' 
          ? html`<button class='btn primary save-button' @click="${this.savePNG}">Save PNG</button>`
          : html`<button class='btn primary save-button' @click="${this.saveGIF}">Save GIF</button>`
        }
        <div class='scene w-100' ?hidden="${this.debug}" >
          <canvas class='scene-canvas w-100' id='scene'></canvas><!-- TODO don't specify if renderer and scene already exist -->
        </div>
        
        <div class='row' ?hidden="${!this.debug}">
          <div class='10 col'>
            <div class='scene w-100'>
              <canvas class='scene-canvas w-100' id='scene'></canvas><!-- TODO don't specify if renderer and scene already exist -->
            </div>
          </div>
          <div class='2 col'>
            <div id='debug' class='w-100'></div>
          </div>
        </div>
      <!--</div>-->
    `;
  }

  @core.classLogger.Log()
  override firstUpdated(): void {
    this.loading = true;

    this.rendererState.shouldRenderSceneId.set(this.sceneId, true);

    // See: https://stackoverflow.com/questions/54512325/getting-width-height-in-a-slotted-lit-element-in-edge
    setTimeout(() => { this.init(); }, 0);
  }

  @core.classLogger.Log()
  private async init() { 
    const sceneElement = this.getSceneElement();

    const rendererConfig: renderer.RendererConfig = { 
      rendererLibrary: this.rendererLibrary,
      sceneElementID: 'scene',
      sceneElement,
      state: this.rendererState,
      sceneId: this.sceneId,
      headless: false, 
      loop: this.levelName === 'static' ? false : true // Renders continuously.
    };

    if (this.debug) { 
      rendererConfig.debug = { enable: true, element: this.getDebugElement() };
    }

    core.logger.debug('rendererConfig', JSON.stringify(rendererConfig));

    this.scene = new ExampleScene(rendererConfig);
    
    if (this.levelName === 'static') {
      this.level = new ExampleStaticLevel(this.scene, () => {
        core.logger.debug('example static level loaded');

        this.loading = false;
      });
      await this.level.load();
    } else {
      this.level = new ExampleOrbitingLevel(this.scene, () => {
        core.logger.debug('example orbiting level loaded');

        this.loading = false;
      });
      this.level.load();
    }
  }

  private getSceneElement(): HTMLCanvasElement {
    return this.renderRoot?.querySelector('#scene') as HTMLCanvasElement;
  }

  private getDebugElement(): HTMLElement {
    return this.renderRoot?.querySelector('#debug') as HTMLElement;
  }

  @core.classLogger.Log()
  private loadScript(src: string): HTMLScriptElement | undefined {
    let script = document.createElement('script');
    
    script.onload = this.onload?.bind(this)!;
    script.src = src;
    script.addEventListener('load', () => {
      core.logger.debug('script loaded');
    });

    document.body.appendChild(script);

    return script;
  }

  @core.classLogger.Log()
  savePNG() {
    if (this.levelName === 'orbiting') {
      throw new Error(constants.strings.notImplementedError);
    } 

    (this.level as ExampleStaticLevel).trySaveFrameAsPNG();
  }

  @core.classLogger.Log()
  saveGIF() {
    if (this.levelName === 'static') {
      throw new Error(constants.strings.notImplementedError);
    } 
    
    (this.level as ExampleOrbitingLevel).trySaveFramesAsGIF();
  }

  @core.classLogger.Log()
  onBeforeLeave() {
    //appState.shouldRenderSceneId.set(this.sceneId, false);

    // TODO
    //this.scene.dispose();
    //this.level.dispose(); ?
  }
}

type ExampleLevelName = 'static' | 'orbiting';